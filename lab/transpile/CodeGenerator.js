// src/CodeGenerator.js
import { jsStatementHandlers } from './src/code-generators/js-statement-handlers.js';
import { jsExpressionHandlers } from './src/code-generators/js-expression-handlers.js';
import { htmlNodeHandlers } from './src/code-generators/html-node-handlers.js';
import { htmlAttributeHandlers } from './src/code-generators/html-attribute-handlers.js';

// Global Helper for unique variable names (now can be a method if preferred, but global is fine if reset)
let globalUniqueIdCounter = 0;
function getUniqueVar(prefix = 'el') {
    return `${prefix}_${globalUniqueIdCounter++}`;
}

export class CodeGenerator {
    constructor() {
        this.imports = new Set();
        this.reactiveScope = new Map();
        this.jsCodeFromScriptBlock = '';
        this.cssCodeFromStyleBlock = '';
        this._rootElementVarName = '';
        // Bind dispatch methods to the instance for easy passing to handlers
        this.generateNodeCode = this.generateNodeCode.bind(this);
        this.generateChildrenCode = this.generateChildrenCode.bind(this);
        this.generateExpressionAsJS = this.generateExpressionAsJS.bind(this);
        this._generateJsStatement = this._generateJsStatement.bind(this);
        this._generateExpressionForJsAST = this._generateExpressionForJsAST.bind(this);
    }

    reset() {
        this.imports.clear();
        globalUniqueIdCounter = 0;
        this.reactiveScope.clear();
        this.jsCodeFromScriptBlock = '';
        this.cssCodeFromStyleBlock = '';
        this._rootElementVarName = '';
    }

    transpile(unifiedAST) {
        this.reset();
        this._rootElementVarName = getUniqueVar('rootEl');

        if (unifiedAST.jsAST && unifiedAST.jsAST.content) {
            this.processScriptBlock(unifiedAST.jsAST.content);
        }
        if (unifiedAST.cssAST && unifiedAST.cssAST.content) {
            this.processStyleBlock(unifiedAST.cssAST.content);
        }

        let htmlBodyCode = '';
        if (unifiedAST.customAST && unifiedAST.customAST.content && unifiedAST.customAST.content.html) {
            const htmlRootNode = unifiedAST.customAST.content.html;
            const rootContext = {
                currentParentVar: this._rootElementVarName,
                reactiveScope: this.reactiveScope,
                eachItemVar: null,
                cleanupQueue: 'cleanupFunctions',
                getUniqueVar: getUniqueVar, // Still pass global helper
                // Pass dispatchers explicitly for HTML generation
                generateExpressionAsJS: this.generateExpressionAsJS,
                generateChildrenCode: this.generateChildrenCode,
                imports: this.imports, // Pass the imports set directly
                attributeHandlers: htmlAttributeHandlers // Pass the attribute handlers map
            };
            htmlBodyCode = this.generateNodeCode(htmlRootNode, rootContext);
        }

        return this.generateFinalModule(htmlBodyCode);
    }

     processScriptBlock(jsProgramAST) {
        // Step 1: Analyze to populate reactiveScope
        jsProgramAST.body.forEach(node => {
            if (node.type === 'VariableDeclaration') {
                node.declarations.forEach(decl => {
                    if (decl.id.type === 'Identifier') {
                        // Mark as reactive if it's initialized with $state() OR $derived()
                        if (decl.init && decl.init.type === 'CallExpression' && decl.init.callee.type === 'Identifier') {
                            if (decl.init.callee.name === '$state') {
                                this.reactiveScope.set(decl.id.name, 'state'); // Use 'state' for $state vars
                                this.imports.add('$state');
                            } else if (decl.init.callee.name === '$derived') {
                                this.reactiveScope.set(decl.id.name, 'derived'); // Use 'derived' for $derived vars
                                this.imports.add('$derived');
                            } else {
                                this.reactiveScope.set(decl.id.name, 'non-reactive'); // Default for other calls
                            }
                        } else if (node.kind === 'let') {
                            // If a `let` variable isn't explicitly $state or $derived, it might become reactive later (less common in simple components)
                            // For simplicity, let's assume direct $state/$derived initialization defines reactivity
                            this.reactiveScope.set(decl.id.name, 'non-reactive');
                        } else {
                            this.reactiveScope.set(decl.id.name, 'non-reactive'); // Default for const/var
                        }
                    }
                });
            } else if (node.type === 'FunctionDeclaration') {
                // Functions are generally non-reactive, but include them if you want
                // to distinguish them from undeclared identifiers.
                this.reactiveScope.set(node.id.name, 'function');
            }
        });

        // Step 2: Generate JS code using the new dispatcher
        this.jsCodeFromScriptBlock = this.generateJsFromAST(jsProgramAST);
    }


    generateJsFromAST(jsASTNode) {
        let code = '';
        jsASTNode.body.forEach(stmt => {
            code += this._generateJsStatement(stmt, { reactiveScope: this.reactiveScope }) + '\n';
        });
        return code;
    }

    // DISPATCHER: For JS AST statements within @script block
    _generateJsStatement(statementNode, context) {
        const handler = jsStatementHandlers[statementNode.type];
        if (handler) {
            // Pass all necessary context and nested dispatchers
            return handler(statementNode, context, this._generateExpressionForJsAST, this._generateJsStatement);
        }
        console.warn(`[CodeGenerator] Unhandled JS AST statement type in @script: ${statementNode.type}`, statementNode);
        return `/* UNHANDLED_JS_STATEMENT_IN_SCRIPT_${statementNode.type} */`;
    }

    // DISPATCHER: For JS AST expressions within @script block
    _generateExpressionForJsAST(expressionNode, context) {
        const handler = jsExpressionHandlers[expressionNode.type];
        if (handler) {
            // Pass all necessary context and nested dispatchers
            return handler(
                expressionNode,
                context,
                this._generateExpressionForJsAST.bind(this), // This is your 'generateExpression'
                this._generateJsStatement.bind(this)         // <-- ADD THIS: This is your 'generateStatement'
            );
        }
        console.warn(`[CodeGenerator] Unhandled JS AST expression type in @script: ${expressionNode.type}`, expressionNode);
        return `/* UNHANDLED_JS_EXPRESSION_IN_SCRIPT_${expressionNode.type} */`;
    }

    // DISPATCHER: For HTML/Template nodes
    generateNodeCode(node, context) {
        if (node.type === 'Element' && node.name === 'customSyntax') {
            return this.generateChildrenCode(node.children, context);
        }
        if (node.type === 'Fragment') {
            return this.generateChildrenCode(node.children, context);
        }

        const handler = htmlNodeHandlers[node.type];
        if (handler) {
            // Pass all necessary context and nested dispatchers
            return handler(node, context, this.generateChildrenCode, this.generateExpressionAsJS, this.imports, htmlAttributeHandlers);
        }
        console.warn(`[CodeGenerator] Unhandled AST node type: ${node.type}`, node);
        return `/* Unhandled node type: ${node.type} */`;
    }

    // This method can remain in CodeGenerator, as it just iterates and dispatches
    generateChildrenCode(children, context) {
        if (!children || children.length === 0) {
            return '';
        }
        return children.map(childNode => this.generateNodeCode(childNode, context)).join('\n');
    }

    // This method can remain in CodeGenerator, as it just dispatches to JS expression handlers but with HTML context nuances
    generateExpressionAsJS(expressionNode, context) {
        const handler = jsExpressionHandlers[expressionNode.type]; // Reuse JS expression handlers
        if (handler) {
            // This handler needs specific logic for 'eachItemVar' and reactive properties in HTML context
            // So, create a specialized version of the JS expression handler for HTML
            const htmlExpressionContext = {
                ...context,
                getIdentifierValue: (name) => {
                // This is the custom logic for HTML expressions
                const scopeType = context.reactiveScope.get(name);
                if (scopeType === 'state' || scopeType === 'derived' || context.eachItemVar === name) {
                    return `${name}.value`; // Return with .value for state, derived, or each item
                }
                return name; // Otherwise, return as is
            }
            };
            return handler(expressionNode, htmlExpressionContext, this.generateExpressionAsJS);
        }
        console.warn(`[CodeGenerator] Unhandled expression node type for HTML: ${expressionNode.type}`, expressionNode);
        return `/* UNHANDLED_HTML_EXPRESSION_TYPE_${expressionNode.type} */`;
    }

    // The rest of your methods (processStyleBlock, generateFinalModule) can remain mostly as is
    // as they handle composition rather than individual AST node generation.
    processStyleBlock(cssRootAST) {
        this.cssCodeFromStyleBlock = cssRootAST.nodes.map(node => {
            if (node.type === 'rule') {
                const declarations = node.nodes.map(decl => `${decl.prop}: ${decl.value};`).join(' ');
                return `${node.selector} { ${declarations} }`;
            }
            return '';
        }).join('\n');
    }

    generateFinalModule(htmlBodyCode) {
        let importStatements = '';

        const semantqImports = Array.from(this.imports).filter(imp =>
            ['$state', '$effect', '$derived', 'state'].includes(imp)
        );
        if (semantqImports.length > 0) {
            importStatements += `import { ${semantqImports.join(', ')} } from './state/index.js';\n`;
        }

        // UPDATED: Added 'clearNodesBetween' to the list of DOM helpers to import
        const domHelpersUsed = Array.from(this.imports).filter(helper =>
            ['insertAfter', 'removeNode', 'reconcileChildren', 'clearNodesBetween'].includes(helper)
        );
        if (domHelpersUsed.length > 0) {
            importStatements += `import { ${domHelpersUsed.join(', ')} } from './runtime/dom-helpers.js';\n`;
        }

        let cssInjectionCode = '';
        if (this.cssCodeFromStyleBlock) {
            cssInjectionCode = `
const __style_el = document.createElement('style');
__style_el.textContent = \`${this.cssCodeFromStyleBlock}\`;
document.head.appendChild(__style_el);
cleanupFunctions.push(() => __style_el.remove()); // Cleanup style tag on component destroy
`;
        }

        const finalRootElVarName = this._rootElementVarName;

        const finalJs = `
${importStatements}

export default function renderComponent() {
  // Component-level reactive state and functions from @script block
${this.jsCodeFromScriptBlock}

  // Root fragment for the component's DOM
  const ${finalRootElVarName} = document.createDocumentFragment();
  const cleanupFunctions = [];

  // Inject CSS if applicable
${cssInjectionCode}

  // The HTML/template body is already generated using the correct parent variable name
${htmlBodyCode}

  // Return the root DOM fragment and a destroy method
  return {
    root: ${finalRootElVarName},
    destroy: () => {
      cleanupFunctions.forEach(fn => fn());
      // Any other component-specific teardown
    }
  };
}
`;
        return finalJs;
    }
}
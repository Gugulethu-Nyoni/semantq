/*

Semantq Parser:

takes:

1. html open close and self closing tags 
2. Plain text with some characters e.g. Clicked: or new-name or Hello World 
3. Html icludes custom syntax logic blocks as shown below

Test with: 


<body>
  <header>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <h1>Welcome to my page!</h1>
      <p>This is some sample content: {counter} - there we go! </p>
    </section>
  </main>

  <div> 

  @if(isAdmin > 2)

  Clicked: {counter > 1? 'times' : 'times'}

  @endif

  </div>

  <footer>
    <p>&copy; 2024 My Page</p>
  </footer>
</body>


ALSO TEST WITH: 


<div>
<button> Clicked: {counter} {counter > 1? 'times' : 'time'}  </button> 
</div>


ALSO: 

<input type="text" @click={rejuice} value={counter} disabled /> + - () 

*/


{

/* GLOBAL GENERIC HELPERS */ 
  
  
  function createNode(type, start, end, additionalProps) {
  const loc = {
    start: {
      line: location().start.line,
      column: location().start.column
    },
    end: {
      line: location().end.line,
      column: location().end.column
    }
  };

  const node = {
    type: type,
    start: start || location().start.offset,
    end: end || location().end.offset,
    loc: loc,
    ...additionalProps
  };

  // Handle MemberExpression case
  if (type === 'MemberExpression') {
    node.computed = false;
    node.optional = false;
  }

  return node;
}

function createMemberExpression(object, property) {
  return createNode('MemberExpression', object.start, property.end, {
    object: object,
    property: property
  });
}

function createUpdateExpression(operator, argument, prefix) {
  return {
    type: "UpdateExpression",
    operator,
    argument,
    prefix,
    start: argument.start || location().start,
    end: location().end
  };
}


function createElement(start, end, name, attributes, children) {
  const processedChildren = Array.isArray(children)
    ? children.flat().filter(x => x !== null && x !== undefined)
    : (children ? [children].filter(x => x !== null && x !== undefined) : []);

  return {
    start,
    end,
    type: "Element",
    name,
    attributes: attributes || [],
    children: processedChildren
  };
}

function createSelfClosingElement(start, end, name, attributes) {
  return {
    type: "Element",
    start,
    end,
    name,
    attributes: attributes || []
  };
}

function createMixedContentNode(parts) { // Removed start, end params as they can be derived
  // Filter out null/undefined parts, but NOT whitespace-only Text nodes
  const validParts = parts.filter(part => part !== null && part !== undefined);

  // If there's only one valid part and it's not already a Fragment,
  // return it directly to avoid unnecessary Fragment nesting.
  if (validParts.length === 1 && validParts[0].type !== 'Fragment') {
    return validParts[0];
  }

  // Calculate start and end from the first and last valid parts
  const start = validParts.length > 0 ? validParts[0].start : undefined;
  const end = validParts.length > 0 ? validParts[validParts.length - 1].end : undefined;

  return {
    type: 'Fragment', // Changed from 'MixedContent' to 'Fragment'
    start: start,
    end: end,
    children: validParts
  };
}



/* START IF BLOCK HELPERS */

  // Helper functions (keeping all your existing ones)
  function createNode(type, start, end, additionalProps) { 
    const node = {
      type: type,
      start: location().start,
      end: location().end,
      ...additionalProps 
    };
    if (additionalProps.expression) {
      node.expression = createNode('Identifier', additionalProps.expression.start, additionalProps.expression.end, {
        name: additionalProps.expression.value,
        loc: {
          start: {
            line: 1,
            column: additionalProps.expression.start + 1
          },
          end: {
            line: 1,
            column: additionalProps.expression.start + 2
          }
        }
      });
    }
    return node;
  }

  function createBinaryExpression(left, operator, right) {
    return createNode('BinaryExpression', left.start, right.end, {
      left: left,
      operator: operator,
      right: right
    });
  } 
  
  function createProgram(body, start, end) { 
    return {
      type: "Program",
      start: start,
      end: end,
      body: body,
      sourceType: "module"
    };
  }
  /*
  function createIfStatement(test, consequent, startToken) {
  return createNode('IfStatement', startToken.start, consequent[consequent.length-1].end, {
    test,
    consequent: createNode('BlockStatement', consequent[0].start, consequent[consequent.length-1].end, {
      body: consequent
    }),
    alternate: null
  });
}
  
  */
  
  function createIfStatement(test, consequent, alternate, startToken) {
  const consequentBlock = createNode(
    'BlockStatement',
    consequent[0]?.start ?? startToken.start,
    consequent[consequent.length - 1]?.end ?? startToken.end,
    { body: consequent }
  );

  let alternateBlock = null;

  if (alternate) {
    alternateBlock = createNode(
      'BlockStatement',
      alternate[0]?.start ?? startToken.start,
      alternate[alternate.length - 1]?.end ?? startToken.end,
      { body: alternate }
    );
  }

  return createNode(
    'IfStatement',
    startToken.start,
    (alternateBlock ?? consequentBlock).end,
    {
      test,
      consequent: consequentBlock,
      alternate: alternateBlock
    }
  );
}


function createEachStatement(iterable, body, startToken) {
  return createNode('EachStatement', startToken.start, body[body.length - 1].end, {
    source: iterable.source,
    item: iterable.item,
    key: iterable.key,
    body: createNode(
      'BlockStatement',
      body[0]?.start ?? startToken.start,
      body[body.length - 1]?.end ?? startToken.end,
      { body }
    )
  });
}



  
  function createUnaryExpression(operator, argument) {
  return createNode('UnaryExpression', operator.start, argument.end, {
    operator: operator,
    argument: argument,
    prefix: true
  });
}


function createCallExpression(callee, args) {
  return createNode('CallExpression', callee.start, args[args.length-1]?.end || callee.end, {
    callee: callee,
    arguments: args
  });
}
/* START CONSEQUENT HELPER FUNCTIONS */ 


function createConsequentExpression(expr) { 
  return {
    type: 'ConsequentExpression',
    start: expr.start,
    end: expr.end,
    expression: expr,
    loc: {
      start: expr.loc?.start || expr.start,
      end: expr.loc?.end || expr.end
    }
  };
}




// Add this to your helper functions
function createConditionalExpression(test, consequent, alternate) {
  return createNode('ConditionalExpression', test.start, alternate.end, {
    test,
    consequent,
    alternate
  });
}


function createArrowFunction(params, body) {
  if (!body || !body.type) {
    error('Invalid arrow function body');
  }
  return createNode('ArrowFunctionExpression', 
    params[0]?.start || body.start, // Handle empty params case
    body.end, {
      params: Array.isArray(params) ? params : [],
      body,
      expression: body.type !== 'BlockStatement'
    });
}

// Add this validation helper
function validateArrowParams(params) {
  if (!Array.isArray(params)) {
    error('Arrow function parameters must be an array');
  }
  return params;
}

/* END CONSEQUENT HELPER FUNCTIONS */

/* END IF BLOCK HELPERS */
/// helper functions wrapper 
  
  /* ALL HELPERS WRAPPER */
}



start
= HTML


_ "optional whitespace"
  = [ \r\t\n]*

__ "required whitespace"
  = [ \r\t\n]+

TextNode
  = text:$(![<] [^@{}\n<]+) {  // Explicitly exclude < and HTML patterns
      return {
        type: 'TextNode',
        value: text.trim(),
        start: location().start,
        end: location().end,
        loc: {
          start: location().start,
          end: location().end
        }
      };
    }


CommentBlock 
  = "<!--" content:$((!"-->" .)*) "-->" _
    {
      return {
        type: 'CommentBlock',
        content: content
      };
    }

  
/* START CONSEQUENT BLOCK */


CodeContent
  = content:$((!"</code>" .)+) {
      return {
        type: 'CodeText', // Or 'TextNode', depending on your AST preference for code content
        value: content,    // Ensure no trim() here
        raw: content,
        start: location().start,
        end: location().end
      };
    }
    
    

HTML
  = fragment:Fragment {
    const children = (fragment.type === "Fragment") ? fragment.children : [fragment];
    const start = fragment.start !== undefined ? fragment.start : (children.length > 0 ? children[0].start : undefined);
    const end = fragment.end !== undefined ? fragment.end : (children.length > 0 ? children[children.length - 1].end : undefined);

    return {
      html: {
        start: start,
        end: end,
        type: "Fragment",
        children: children
      }
    };
  }

Fragment
  = fragments:(MustacheTag / LogicBlock / OpenCloseTags / SelfClosingTags / TextNode / CommentBlock)+ {
      return createMixedContentNode(fragments);
    }

/*
OpenCloseTags
  = _ openTag:OpenTag _ inner:InnerContent? _ closeTag:CloseTag  _ {
    return createElement(openTag.start, closeTag.end, openTag.name, openTag.attributes, [inner]);
  }
*/

OpenCloseTags
  = _ codeTag:CodeHtmlTag { return codeTag; }
  / _ openTag:OpenTag _
    innerContent:InnerContent? // Make innerContent optional and directly use its result
    _ closeTag:CloseTag _ {
      const children = innerContent ? (innerContent.type === 'Fragment' ? innerContent.children : [innerContent]) : [];
      return createElement(openTag.start, closeTag.end, openTag.name, openTag.attributes, children);
    }
    

SelfClosingTag
  = _ "<" tagName:TagName _ attributes:Attributes? _ "/>" _ {
      return { 
        start: location().start.offset, 
        end: location().end.offset, 
        name: tagName, 
        attributes: attributes || [] 
      };
    }

SelfClosingTags
  = openTag:SelfClosingTag {
    return createSelfClosingElement(openTag.start, openTag.end, openTag.name, openTag.attributes, []);
  }


OpenTag
  = _ "<" tagName:TagName _ attributes:Attributes? _ ">" _ {
    return { start: location().start.offset, end: location().end.offset, name: tagName, attributes };
  }

CloseTag 
  = _ "</" tagName:TagName _ ">" _ {
    return { start: location().start.offset, end: location().end.offset, name: tagName };
  }



CodeHtmlTag
  = _ "<" "code" _ attributes:Attributes? _ ">" codeContent:CodeContent "</code>" _ {
      return createElement(location().start.offset, location().end.offset, "code", attributes || [], [codeContent]);
    }

/*
SelfClosingTag
  = _ "<" tagName:TagName _ attributes:Attributes? _ "/>" _ {
      return { 
        start: location().start.offset, 
        end: location().end.offset, 
        name: tagName, 
        attributes: attributes || [] 
      };
    }
  / "<" tagName:TagName _ attributes:Attributes? _ ">" {
      error("Expected '/>' to close self-closing tag. Either: \n" +
            "1. Add '/>' to make self-closing (like <" + tagName + "/>), or\n" +
            "2. Add closing tag </" + tagName + "> to make a complete element");
    }
  / "<" tagName:TagName {
      error("Incomplete tag. Expected either:\n" +
            "- Self-closing syntax: <" + tagName + " ... />\n" +
            "- Complete element: <" + tagName + ">...</" + tagName + ">");
    }



SelfClosingTag
  = _ "<" tagName:TagName _ attributes:Attributes? _ "/>" _ {
      return { 
        start: location().start.offset, 
        end: location().end.offset, 
        name: tagName, 
        attributes: attributes || [] 
      };
    }
  / "<" tagName:TagName _ attributes:Attributes? _ ">" {
      // Remove this error case since it conflicts with OpenCloseTags
      return null; // Let OpenCloseTags handle this case
    }
  / "<" tagName:TagName {
      error("Incomplete tag. Expected either:\n" +
            "- Self-closing syntax: <" + tagName + " ... />\n" +
            "- Complete element: <" + tagName + ">...</" + tagName + ">");
    }
*/



TagName
  = name:$([a-zA-Z0-9]+) { return name; }


/* START ATTRIBUTE BLOCK */



Attributes
  = head:AttributeTypes tail:(_ AttributeTypes)* {
      return [head, ...tail.map(t => t[1])];
    }

AttributeTypes
  = TwoWayBindingAttribute
  / EventHandlerAttribute
  / BooleanIdentifierAttribute
  / KeyValueAttribute
  / BooleanAttribute // Add this

ExpressionAttribute
  = ArrowFunction
  / UpdateExpression



// --- TOP-LEVEL ATTRIBUTE DISPATCH RULE ---
// This rule tries the most specific attribute types first.
BasicHtmlAttribute
  = TwoWayBindingAttribute       // Catches `bind:value={count}`
  / EventHandlerAttribute        // Catches `onclick={handler}` or `@click={handler}`
  / BooleanIdentifierAttribute   // Catches `readonly`, `disabled` (attributes by presence)
  / KeyValueAttribute            // Catches `class="my-class"`, `type="number"`, etc.
  // Add any other specific attribute types here if you have them (e.g., SpreadAttribute)

// --- SPECIFIC ATTRIBUTE RULES ---



KeyValueAttribute
  = _ attributeName:AttributeName _ "=" _ attributeValue:AttributeValue _ {
      // Check the 'type' property of the 'attributeName' AST node that was parsed
      if (attributeName.type === "EventHandler") {
          // If the name (e.g., @click) was identified as an EventHandler by SemantqAttributeName,
          // then the entire attribute should be an EventHandler.
          return {
              // Use the start/end from the name and value nodes for more accurate positioning
              start: attributeName.start,
              end: attributeValue.end, // Assuming attributeValue has a reliable 'end'
              type: "EventHandler",     // <--- THIS IS THE CRITICAL CHANGE: Set top-level type
              name: attributeName.name, // This will be the clean event name (e.g., 'click')
              modifiers: attributeName.modifiers,
              value: attributeValue     // This will be the AST for the JS expression (e.g., {type: "MustacheAttribute", ...})
          };
      } else {
          // If it's not an EventHandler (i.e., it's a regular attribute like id="foo")
          // then keep it as a KeyValueAttribute.
          return {
              start: location().start.offset, // Use location for the whole attribute rule
              end: location().end.offset,
              // Removed the duplicate 'type: "Attribute"' - keeping the intended one.
              type: "KeyValueAttribute", // The type for standard key-value attributes
              name: attributeName,       // The full AST node for the attribute name (e.g., {type: "Identifier", name: "id"})
              value: [attributeValue]    // Keep value as an array if your handler expects it
          };
      }
    }
    
BooleanAttribute
  = _ name:ExtendedIdentifier _ &("/>" / ">" / _) { // Lookahead for tag end or next attribute
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "Attribute",
        smqtype: "BooleanAttribute", 
        name: name,
        value: true
      };
    }
  
BooleanIdentifierAttribute
  = _ "{" _ name: Identifier _ "}" _ {
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "Attribute",
        smqtype:"BooleanIdentifierAttribute",
        name: name,
        value: true
      };
    }



// --- SPECIFIC ATTRIBUTE RULES ---

// 1. Two-Way Binding Attribute (e.g., bind:value={count})
// This rule specifically looks for the "bind:" prefix.
TwoWayBindingAttribute "two-way binding attribute"
  = "bind:" propertyName:ExtendedIdentifier _ "=" _ value:AttributeValue {
      // propertyName: e.g., "value" (string)
      // value: The AST node for the expression, often a MustacheAttributeValue
      if (value.type !== "MustacheAttribute") {
          error("Two-way binding ('bind:') attributes must have a mustache expression value (e.g., {variable}).");
      }
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "TwoWayBindingAttribute", // CRITICAL: The type your handler expects
        name: propertyName,             // The string "value" (or "checked", etc.)
        expression: value.expression    // The AST for `count` (or whatever JS expression)
      };
    }

// 2. Event Handler Attribute (e.g., onclick={() => count++} or @click={handler})
// This rule looks for "on" prefix or "@" prefix.
EventHandlerAttribute "event handler attribute"
  = (eventName:DomEventName / eventName:SemantqAttributeName) // Matches "onclick" or "@click"
    modifiers:ModifierList? _ "=" _ value:(
      MustacheAttributeValue // Still allow {handler} syntax
      / ArrowFunctionValue  // Add direct arrow function support
      / RegularAttributeValue // Fallback
    ) {
      // eventName processing remains the same
      let nameString = typeof eventName === 'string' ? eventName : eventName.name;
      let existingModifiers = typeof eventName === 'object' && eventName.modifiers ? eventName.modifiers : [];

      // Handle different value types
      let expressionValue;
      if (value.type === "MustacheAttribute") {
        expressionValue = value.expression;
      } else if (value.type === "ArrowFunctionExpression") {
        expressionValue = value;
      } else {
        // For regular attribute values, wrap in a literal
        expressionValue = {
          type: "Literal",
          value: value.raw || value.value,
          raw: value.raw || `"${value.value}"`
        };
      }

      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "EventHandler",
        name: nameString,
        modifiers: modifiers ? modifiers : existingModifiers,
        value: expressionValue
      };
    }



ArrowFunctionValue
  = _ "(" params:ArrowParams? ")" _ "=>" _ body:ArrowFunctionBody _ {
      return createArrowFunction(params || [], body);
    }

// 3. Boolean Identifier Attribute (e.g., readonly, disabled, checked - by presence)
// This rule looks for a standalone identifier NOT followed by an equals sign.
BooleanIdentifierAttribute "boolean identifier attribute"
  = name:ExtendedIdentifier !( _ "=" _ ) { // Ensure no '=' follows, making it a simple presence
      // name: e.g., "readonly" (string)
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "BooleanIdentifierAttribute", // CRITICAL: The type your handler expects
        name: name                         // The string "readonly"
      };
    }

// 4. Key-Value Attribute (e.g., class="my-class", type="number")
// This is the general fallback for attributes not caught by more specific rules.
KeyValueAttribute "key-value attribute"
  = name:ExtendedIdentifier _ "=" _ value:AttributeValue {
      // name: e.g., "class" (string)
      // value: The AST node for the attribute's value (Text, MustacheAttribute)
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "KeyValueAttribute",
        name: name,
        value: [value] // Your current AST uses an array for values, so keep this.
      };
    }

// --- HELPER RULES ---

// Rule for "onclick", "oninput", etc. (strips "on" prefix in action)
DomEventName "DOM event name"
  = "on" name:ExtendedIdentifier {
      return name; // Returns "click" from "onclick"
    }


  // ModifierList: For event modifiers like .prevent, .stop (if you support them)
// Example: @click.prevent
ModifierList = ( "." modifier:ExtendedIdentifier )+ { return results; }


AttributeName
  =  ExtendedIdentifier / SemantqAttributeName
  
 SemantqAttributeName
= "@" name:$([a-zA-Z_-]+) {
  return {
    start: location().start.offset,
    end: location().end.offset,
    type: "EventHandler", // Keep this - it correctly identifies the attribute type
    name: name,            // Keep this - it's the actual event name (e.g., 'click')
    modifiers: []
    // REMOVE THE 'expression' PROPERTY HERE.
    // The actual JS expression for the handler will be attached by the rule
    // that combines the attribute name and its value (e.g., in a rule like KeyValueAttribute)
  };
}



ExtendedIdentifier
  = $([a-zA-Z_$][a-zA-Z_0-9\-\:]*) // Include dash '-' and colon ':' 

AttributeValue
= IIFE / ArrowFunctionCall / MustacheAttributeValueWithParams / MustacheAttributeValue / RegularAttributeValue / RegularFunctionalCall

RegularAttributeValue
  = "\"" value:[^\"]* "\"" {
      return {
        start: location().start.offset + 1,  // Adjust to start after the opening quote
        end: location().end.offset - 1,      // Adjust to end before the closing quote
        type: "Text",
        raw: value.join(""),
        data: value.join("")
      };
    } /  "" ;
    
    
MustacheAttributeValue
= "{" _ expr:MustacheExpression _ "}" { // Changed 'value:MustacheAttributeValueIdentifier' to 'expr:MustacheExpression'
      return {
        start: location().start.offset, // Start from the '{'
        end: location().end.offset,     // End at the '}'
        type: "MustacheAttribute",
        expression: expr // Store the parsed expression AST here
      };
    }



 MustacheAttributeValueIdentifier
 = ChainedIdentifier / Identifier
  
MustacheAttributeValueWithParams
= "{" name:Identifier "(" params:Arguments? ")" "}" {
  return {
    start: location().start.offset + 1,
    end: location().end.offset - 1,
    type: "MustacheAttributeValueWithParams", // <--- Changed here
    name: name,
    modifiers: [],
    expression: {
      type: "CallExpression",
      start: location().start.offset + 1,
      end: location().end.offset - 1,
      loc: {
        start: {
          line: location().start.line,
          column: location().start.column + 1
        },
        end: {
          line: location().end.line,
          column: location().end.column - 1
        }
      },
      callee: {
        type: "Identifier",
        start: location().start.offset + 1,
        end: location().start.offset + name.length,
        loc: {
          start: {
            line: location().start.line,
            column: location().start.column + 1
          },
          end: {
            line: location().start.line,
            column: location().start.column + name.length
          }
        },
        name: name
      },
      arguments: params || [],
      optional: false
    }
  };
}


Arguments
= MultipleArguments / SingleArgument


SingleArgument
= param:Identifier {
  return {
    type: "Identifier",
    start: location().start.offset,
    end: location().end.offset,
    loc: {
      start: {
        line: location().start.line,
        column: location().start.column
      },
      end: {
        line: location().end.line,
        column: location().end.column
      }
    },
    name: param
  };
}


MultipleArguments
  = head:ParamIdentifier tail:("," _ param:ParamIdentifier { return param; })* {
      const args = [head];

      for (const param of tail) {
        args.push(param);
      }
      
      return args;
    }

ParamIdentifier
  = name:$([a-zA-Z_$][a-zA-Z_0-9]*)
    {
      const start = location().start.offset;
      const end = location().end.offset;
      const loc = {
        start: {
          line: location().start.line,
          column: location().start.column
        },
        end: {
          line: location().end.line,
          column: location().end.column
        }
      };

      return {
        type: 'Identifier',
        start,
        end,
        loc,
        name
      };
    }



RegularFunctionalCall
  = name:Identifier "(" args:MultipleArguments? ")" {
      return {
        type: "FunctionCall",
        start: location().start.offset,
        end: location().end.offset,
        callee: name,
        arguments: args || []
      };
    }
  / name:Identifier "(" {
      error(`Unclosed parentheses in ${name.name}() call`);
    }
  / name:Identifier {
      error(`Missing parentheses after ${name.name}. Expected ${name.name}(...)`);
    }


ArrowFunctionCall
  = "{" _ "(" params:ArrowParams? ")" _ "=>" _ body:ArrowFunctionBody _ "}" {
      return {
        type: "ArrowFunctionExpression",
        start: location().start.offset + 1,
        end: location().end.offset - 1,
        loc: {
          start: {
            line: location().start.line,
            column: location().start.column + 1
          },
          end: {
            line: location().end.line,
            column: location().end.column - 1
          }
        },
        params: params || [],
        body: body,
        expression: body.type !== 'BlockStatement'
      };
    }

ArrowParams
  = head:Identifier tail:(_ "," _ Identifier)* {
      return [head, ...tail.map(t => t[3])];
    }

ArrowFunctionBody
  = PostfixUnaryExpression
  / CallExpression
  / Identifier
  / UpdateExpression
  / BlockStatement


BlockStatement
  = "{" _ statements:Statement* _ "}" {
      return {
        type: "BlockStatement",
        body: statements
      };
    }

Statement
  = ExpressionStatement

ExpressionStatement
  = expression:Expression _ ";"? {
      return {
        type: "ExpressionStatement",
        expression: expression
      };
    }

Expression
  = CallExpression
  / Identifier


IIFE
= "{" _ "(" _ "function" _ "(" params:MultipleArguments? ")" _ "{" _ Identifier:Identifier "(" _ parameters:MultipleArguments? _ ")" _ "}" _ ")" _ "(" _ ")" _ "}" {
  return {
    type: "IIFE",
    start: location().start.offset + 1,
    end: location().end.offset - 1,
    loc: {
      start: {
        line: location().start.line,
        column: location().start.column + 1
      },
      end: {
        line: location().end.line,
        column: location().end.column - 1
      }
    },
    params: params || [],
    identifier: Identifier,
    parameters: parameters || [],
    arguments: [] // no arguments for IIFE call
  };
}

Params
= Identifier* 

  
InnerContent
  = parts:(HtmlTagWithExpressions / LogicBlock / TextWithExpressions / CommentBlock / TextNode)* {
      const flattened = parts.flat().filter(x => x !== null && x !== undefined);

      if (flattened.length === 1 && flattened[0].type !== 'Fragment') {
        return flattened[0];
      }
      if (flattened.length === 0) {
          return null;
      }

      const start = flattened[0]?.start !== undefined ? flattened[0].start : location().start.offset;
      const end = flattened[flattened.length - 1]?.end !== undefined ? flattened[flattened.length - 1].end : location().end.offset;

      return {
        type: 'Fragment',
        children: flattened,
        start: start,
        end: end
      };
    }

/* END ATTRIBUTE BLOCK */

/* START IF LOGIC BLOCK HERE */

Program
  = __ body:(IfStatement)* __ { 
      return createProgram(body, 0, location().end.offset);
    }

LogicBlock
= EachStatement / IfStatement

/*
IfStatement
  = _ startToken:"@if" "(" test:Condition ")" _ 
    content:ContentBody 
    "@endif"_ {
      const contentNode = content.length > 0 
        ? content 
        : [createNode('BlockStatement', location().start, location().end, { body: [] })];
      return createIfStatement(test, contentNode, startToken);
    }
*/

IfStatement 
  = _ startToken:"@if" _ "(" _ test:Condition _ ")" _ 
    consequent:ContentBody
    elsePart:(_ "@else" _ alternate:ContentBody)? 
    "@endif" _ {
      const contentNode = consequent.length > 0 
        ? consequent 
        : [createNode('BlockStatement', location().start, location().end, { body: [] })];

      const alternateNode = elsePart 
        ? (elsePart[3].length > 0 
            ? elsePart[3] 
            : [createNode('BlockStatement', location().start, location().end, { body: [] })])
        : null;

      return createIfStatement(test, contentNode, alternateNode, startToken);
    }



ContentBody
  = _ contents:(ContentLine / __)* _ {
      // Flatten and filter valid nodes
      const flattened = contents.flat().filter(x => 
        x && (x.type || (typeof x === 'object' && Object.keys(x).length > 0))
      );
      return flattened;
    }

ContentLine
  = content:(
      IfStatement
      / EachStatement
      / HtmlTagWithExpressions
      / Interpolations // This is MustacheTag for HTML interpolation
      / ConsequentContentBlock // Use ConsequentContentBlock for general nested content
      / TextNode
      / CommentBlock
    ) _ {
      return content;
    }

HtmlTagWithExpressions
  = OpenCloseTags
  / SelfClosingTags
  / TextWithExpressions // TextWithExpressions handles mixed text and expressions
  / CommentBlock


TextWithExpressions
  = parts:(TextPart / MustacheTag / ConsequentExpression / CommentBlock / ConsequentContentBlock)+ { // Changed to ConsequentContentBlock
      const validParts = parts.flatMap(part =>
        Array.isArray(part) ? part : [part]
      ).filter(part =>
        part && (part.type !== 'TextNode' || part.value.trim().length > 0)
      );

      if (validParts.length === 1) return validParts[0];
      return createMixedContentNode(validParts);
    }


TextPart
  = _ text:$([^@{}\n<]+) _ {
      return text.trim() ? {
        type: 'TextNode',
        value: text.trim(),
        start: location().start,
        end: location().end
      } : null;
    }

/* ADD HERE */


Interpolations
= Expression / MustacheTag

MustacheTag
  = _ "{" _ expr:MustacheExpression _ "}" _ {
      return {
        type: 'MustacheTag',
        expression: expr,
        start: location().start,
        end: location().end
      };
    }

// Ensure MustacheExpression points to FullJSExpression for its parsing logic.
MustacheExpression
  = FullJSExpression; // All mustache expressions are now handled by the comprehensive FullJSExpression

  

TemplateLiteral
  = "`" parts:TemplatePart* "`" {
      return {
        type: 'TemplateLiteral',
        parts: parts,
        start: location().start,
        end: location().end
      };
    }

TemplatePart
  = "${" expr:MustacheExpression "}" {
      return {
        type: 'TemplateExpression',
        expression: expr
      };
    }
  / $[^`$]+ {
      return {
        type: 'TemplateText',
        value: text()
      };
    }

// Reuse all your existing expression rules
TernaryExpression
  = test:LogicalORExpression _ "?" _ consequent:MustacheExpression _ ":" _ alternate:MustacheExpression {
      return createConditionalExpression(test, consequent, alternate);
    }

LogicalORExpression
  = left:LogicalNullishExpression _ "||" _ right:LogicalORExpression { return createBinaryExpression(left, "||", right); }
  / LogicalNullishExpression

LogicalNullishExpression
  = left:LogicalANDExpression _ "??" _ right:LogicalNullishExpression { return createBinaryExpression(left, "??", right); }
  / LogicalANDExpression
  

LogicalANDExpression
  = left:BitwiseExpression _ "&&" _ right:LogicalANDExpression { return createBinaryExpression(left, "&&", right); }
  / BitwiseExpression

BitwiseExpression
  = left:EqualityExpression _ op:(">>>" / "&" / "|" / "^" / "<<" / ">>") _ right:BitwiseExpression {
      return createBinaryExpression(left, op, right);
    }
  / EqualityExpression

EqualityExpression
  = left:RelationalExpression _ op:("===" / "!==" / "!=" / "==") _ right:EqualityExpression { return createBinaryExpression(left, op, right); }
  / RelationalExpression

RelationalExpression
  = left:AdditiveExpression _ op:("<=" / ">=" / "<" / ">") _ right:RelationalExpression { return createBinaryExpression(left, op, right); }
  / AdditiveExpression

AdditiveExpression
  = left:MultiplicativeExpression _ op:("+" / "-") _ right:AdditiveExpression { return createBinaryExpression(left, op, right); }
  / MultiplicativeExpression

MultiplicativeExpression
  = left:LeftHandSideExpression _ op:("*" / "/" / "%") _ right:MultiplicativeExpression {
      return createBinaryExpression(left, op, right);
    }
  / LeftHandSideExpression


LeftHandSideExpression
  = CallExpression
  / MemberExpression
  / PostfixUnaryExpression
  / PrimaryExpression



PostfixUnaryExpression
  = argument:Identifier _ operator:("++" / "--") {
      return {
        type: "PostfixUnaryExpression",
        argument,
        operator,
        prefix: false,
        loc: location(),
        start: argument.start,
        end: location().end
      };
    }



PrimaryAtom
  = Identifier
  / NumericLiteral
  / StringLiteral
  / Literal
  / ArrayLiteral
  / ObjectLiteral
  / "(" _ MustacheExpression _ ")" { return expr; }


PrimaryExpression
  = ArrayLiteral
  / ObjectLiteral
  / "(" _ expr:FullJSExpression _ ")" { return expr; } // Parenthesized expressions contain a full expression
  / NumericLiteral
  / StringLiteral
  / Literal
  / Identifier // A simple identifier is a primary expression
  ;



UpdateExpression
  = argument:Identifier _ op:("++" / "--") {
      return createUpdateExpression(op, argument, false);
    }



CallExpression
  = callee:MemberExpression _ "(" args:ArgumentList? ")" {
      return createCallExpression(callee, args || []);
    }

MemberExpression
  = head:PrimaryAtom tail:(
      "[" _ expr:MustacheExpression _ "]"  // Array access
      / "." _ prop:Identifier              // Property access
      / "?." _ prop:Identifier             // Optional chaining
    )* {
      return tail.reduce((acc, part) => {
        if (part[1] === '[') {
          // Array access
          return {
            type: 'MemberExpression',
            object: acc,
            property: part[2],
            computed: true,
            optional: false
          };
        } else if (part[1] === '?.') {
          // Optional chaining
          return {
            type: 'MemberExpression',
            object: acc,
            property: part[2],
            computed: false,
            optional: true
          };
        } else {
          // Regular property access
          return {
            type: 'MemberExpression',
            object: acc,
            property: part[2],
            computed: false,
            optional: false
          };
        }
      }, head);
    }

UnaryExpression
  = op:("!" / "+" / "-" / "~" / "typeof" / "void" / "delete" / "++" / "--") _ argument:AtomicExpression {
      return createUnaryExpression(op, argument);
    }

AtomicExpression
  = Identifier
  / Literal
  / "(" _ FullJSExpression _ ")" // Use FullJSExpression here for consistent parsing of parenthesized expressions
  ;


ArgumentList
  = head:MustacheExpression tail:(_ "," _ MustacheExpression)* {
      return [head, ...tail.map(t => t[3])];
    }

// Literals (keep your existing definitions)
NumericLiteral
  = value:$[0-9]+ {
      return createNode('Literal', location().start, location().end, {
        value: parseInt(value, 10),
        raw: value
      });
    }

ArrayLiteral
  = "[" _ elements:(MustacheExpression (_ "," _ MustacheExpression)*)? _ "]" {
      const items = elements
        ? [elements[0], ...elements[1].map(e => e[3])]
        : [];
      return {
        type: "ArrayExpression",
        elements: items,
        start: location().start,
        end: location().end
      };
    }



ObjectLiteral
  = "{" _ pairs:(ObjectPair (_ "," _ ObjectPair)*)? _ "}" {
      const properties = pairs
        ? [pairs[0], ...pairs[1].map(p => p[3])]
        : [];
      return {
        type: "ObjectExpression",
        properties,
        start: location().start,
        end: location().end
      };
    }

ObjectPair
  = key:Identifier _ ":" _ value:MustacheExpression {
      return {
        type: "Property",
        key,
        value
      };
    }




StringLiteral
  = "'" chars:$[^']* "'" 
  / '"' chars:$[^"]* '"' {
      return createNode('Literal', location().start, location().end, {
        value: chars,
        raw: text()
      });
    }

Literal
  = "true" { 
      return createNode('Literal', location().start, location().end, {
        value: true,
        raw: "true"
      });
    }
  / "false" {
      return createNode('Literal', location().start, location().end, {
        value: false,
        raw: "false"
      });
    }
  / "null" {
      return createNode('Literal', location().start, location().end, {
        value: null,
        raw: "null"
      });
    }
  / "undefined" {
      return createNode('Literal', location().start, location().end, {
        value: undefined,
        raw: "undefined"
      });
    }

Identifier
  = name:$([a-zA-Z_][a-zA-Z0-9_]*) {
      return createNode('Identifier', location().start, location().end, { 
        name: name 
      });
    }

ChainedIdentifier
  = head:Identifier tail:("." prop:Identifier { return prop; })* {
      return tail.reduce((acc, property) => {
        return createMemberExpression(acc, property);
      }, head);
    }



/* END ADD HERE */


Condition
  = head:LogicalORExpression { return head; }






  
  
  
  
  // Add parenthesized version
ParenthesizedBitwise
  = BitwiseExpression
  / "(" _ expr:BitwiseExpression _ ")" { return expr; }

// Keep all your existing Parenthesized rules but add:

ParenthesizedLogicalOR
  = LogicalORExpression
  / "(" _ expr:LogicalORExpression _ ")" { return expr; }

ParenthesizedLogicalAND
  = LogicalANDExpression
  / "(" _ expr:LogicalANDExpression _ ")" { return expr; }

ParenthesizedEquality
  = EqualityExpression
  / "(" _ expr:EqualityExpression _ ")" { return expr; }


 





  /* START CONSEQUENT */
  
  

// NEW RULE: ConsequentContentBlock
// This rule allows content that is explicitly within a block like an @if or @each.
// It can contain HTML elements, expressions, and text.


ConsequentContentBlock
  = parts:(MustacheTag / LogicBlock / OpenCloseTags / SelfClosingTags / TextNode / CommentBlock)+ {
      return createMixedContentNode(parts);
    }

ConsequentContent
  = ConsequentExpression // Only allows a direct expression now
  / MustacheTag // If a mustache tag is treated as a consequent
  / TextNode // Plain text that might be a consequent
  / CommentBlock // Comments are okay
  / ConsequentContentBlock // Allows a block of mixed content, but only if explicitly a "block"
  ;

  
ConsequentExpression
= ArrowFunction
  / TernaryExpression
  / PostfixUnaryExpression // Added to handle count++
  / UnaryExpression // Handles -count, !isAdmin, etc.
  / CallExpression // Handles function()
  / MemberExpression // Handles obj.prop
  / Identifier // Handles single identifiers like 'counter'
  / Literal // Handles 'true', '123', '"hello"'
  / ArrayLiteral
  / ObjectLiteral
  / ExistingExpression // Keep for other complex expressions



// Reuse all existing expression rules through this proxy rule
ExistingExpression
  = LogicalORExpression  // This automatically includes all lower precedence rules
                         // via your existing expression hierarchy

// Only need to add these new rules:
// Then update your grammar:

    
ArrowFunction
  = params:ArrowParameters _ "=>" _ body:(ArrowFunctionBody / UnaryExpression / UpdateExpression) {
      return createArrowFunction(params, body);
    }



ArrowParameters
  = "(" _ ")" { return []; }  // Explicit empty params
  / "(" _ params:ParameterList? _ ")" { return params || []; }
  / param:Identifier { return [param]; }

ParameterList
  = head:Identifier tail:(_ "," _ Identifier)* {
      return [head, ...tail.map(t => t[3])];
    }

ArrowBody
  = BlockStatement
  / FullJSExpression // NEW: A more comprehensive rule for single JS expressions
  / StringLiteral;



// Define FullJSExpression to encompass all possible expression types
FullJSExpression
  = TernaryExpression         // Highest-level conditional
  / LogicalORExpression       // Logical OR (lowest binary precedence)
  / LogicalNullishExpression
  / LogicalANDExpression
  / BitwiseExpression
  / EqualityExpression
  / RelationalExpression
  / AdditiveExpression
  / MultiplicativeExpression
  / UnaryExpression           // IMPORTANT: Unary (like '!') must be tried before anything that might consume its argument as a primary.
  / PostfixUnaryExpression    // IMPORTANT: Postfix (like '++') must be tried before just a plain identifier.
  / CallExpression            // Function calls
  / MemberExpression          // Property access (dot or bracket)
  / PrimaryExpression         // The base atoms (literals, identifiers, parenthesized expressions)
  ;



ValidExpression
  = ExistingExpression  // Reuse your existing expression rules
  / AdditiveExpression  // Ensure math ops work
  / MultiplicativeExpression
  
/* END CONSEQUENT BLOCK */

/* START EACH STATEMENT BLOCK */

EachStatement
  = _ startToken:"@each" _ "(" iterable:EachSource ")" _ 
    body:ContentBody
    "@endeach" _ {
      return createEachStatement(iterable, body, startToken);
    }



EachSource
  = source:JSExpression _ "as" _ item:Identifier _ 
    keyPart:(
      "(" keyExpression:JSExpression ")" 
      / keyExpression:JSExpression
    )? {
      const key = keyPart ? (keyPart[0] ? keyPart[1] : keyPart[0]) : null; // Handle both formats
      return {
        source,
        item,
        key
      };
    }




JSExpression
  = ChainedIdentifier
  / Identifier
  / PostfixUnaryExpression // Allow post-fix for bind:value and similar
  / CallExpression
  / Literal
  / NumericLiteral
  / StringLiteral
  / UnaryExpression
  / TernaryExpression
  / LogicalORExpression // Include all logical/binary expressions

    
/* END EACH BLOCK */




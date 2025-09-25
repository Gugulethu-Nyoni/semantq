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

  // Handle MemberExpression case (keep this as it's a specific, valid transformation)
  if (type === 'MemberExpression') {
    // These defaults should only be applied if not already explicitly set in additionalProps
    if (node.computed === undefined) {
      node.computed = false;
    }
    if (node.optional === undefined) {
      node.optional = false;
    }
  }

  // Removed the problematic if (additionalProps.expression) block.
  // Properties like 'expression', 'test', 'consequent', 'alternate', etc.,
  // should already be correctly formed AST nodes by the time they are passed
  // in `additionalProps` from the specific parsing rules.

  return node;
}


function createMemberExpression(object, property) {
  return createNode('MemberExpression', object.start, property.end, {
    object: object,
    property: property
  });
}

function createUpdateExpression(operator, argument, prefix, startOffset, endOffset) {
  return {
    type: "UpdateExpression",
    operator,
    argument,
    prefix,
    start: startOffset, // Use provided startOffset
    end: endOffset      // Use provided endOffset
  };
}

// REVISED HELPER FOR UnaryExpression
function createUnaryExpression(operator, argument, startOffset, endOffset) {
  return createNode('UnaryExpression', startOffset, endOffset, { // Use createNode now
    operator: operator,
    argument: argument,
    prefix: true // Unary operators are always prefix in standard JS AST
  });
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
 = text:$(!('@if' / '@each' / '<') [^<]+) {
  return {
   type: 'TextNode',
   value: text,
   raw: text,
   start: location().start,
   end: location().end,
   loc: {
    start: location().start,
    end: location().end
   }
  };
 }


// NEW/REVISED RULE: TextContent (Allows any plain text, including spaces/newlines, 
// stopping ONLY at the next control structure, tag, or interpolation start)
TextContent
 = text:$((
   // Lookahead prevents matching the start of a Directive, Tag, or Mustache
   !('@' / '<' / '{') .
  )+) {
   const start = location().start.offset;
   const end = location().end.offset;
   return {
    type: 'TextNode',
    value: text,
    raw: text,
    start: start,
    end: end
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

// Find this rule in your grammar and update the order
Fragment
 = fragments:(LogicBlock / RawPreBlock / RawCodeBlock / MustacheTag / OpenCloseTags / SelfClosingTags / TextNode / CommentBlock)+ {
  const start = fragments[0].start;
  const end = fragments[fragments.length - 1].end;
  return createNode('Fragment', start, end, {
   children: fragments.filter(x => x !== null && x !== undefined)
  });
 }


/*
OpenCloseTags
  = _ openTag:OpenTag _ inner:InnerContent? _ closeTag:CloseTag  _ {
    return createElement(openTag.start, closeTag.end, openTag.name, openTag.attributes, [inner]);
  }
*/

OpenCloseTags
 = _ rawHtml:(RawPreBlock / RawCodeBlock) { return rawHtml; }
 / _ openTag:OpenTag _
  innerContent:InnerContent?
  _ closeTag:CloseTag _ {
   const children = innerContent ? (innerContent.type === 'Fragment' ? innerContent.children : [innerContent]) : [];
   return createElement(openTag.start, closeTag.end, openTag.name, openTag.attributes, children);
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

SelfClosingTag
  = _ "<" tagName:TagName _ attributes:Attributes? _ "/>" _ {
      return { 
        start: location().start.offset, 
        end: location().end.offset, 
        name: tagName, 
        attributes: attributes || [] 
      };
    }


TagName
  = name:$([a-zA-Z0-9]+) { return name; }


RawPreBlock "pre block"
  = "<" "pre" _ attributes:Attributes? _ ">"
    content:$((!"</pre>") .)*
    "</pre>"
    {
      const loc = location();
      return {
        type: "RawHTMLBlock",
        name: "pre",
        attributes: attributes || [],
        content: content,
        start: loc.start.offset,
        end: loc.end.offset
      };
    }

RawCodeBlock "code block"
  = "<" "code" _ attributes:Attributes? _ ">"
    content:$((!"</code>") .)*
    "</code>"
    {
      const loc = location();
      return {
        type: "RawHTMLBlock",
        name: "code",
        attributes: attributes || [],
        content: content,
        start: loc.start.offset,
        end: loc.end.offset
      };
    }




/* START ATTRIBUTE BLOCK */

    
/* TOP-LEVEL ATTRIBUTE RULES */

// This is the primary entry point for parsing attributes on an element.
Attributes
  = head:BasicHtmlAttribute tail:(_ BasicHtmlAttribute)* {
      return [head, ...tail.map(t => t[1])];
    }

// This is the logical hierarchy for matching different attribute types.
// Order is crucial: from most specific to most general.
BasicHtmlAttribute
  = EventHandler           // e.g., @click={handler}
  / TwoWayBindingAttribute // e.g., bind:value={variable}
  / MustacheAttribute      // e.g., value={variable}
  / KeyValueAttribute      // e.g., type="number"
  / BooleanIdentifierAttribute // e.g., {disabled}
  / BooleanAttribute       // e.g., disabled

/* SPECIFIC ATTRIBUTE TYPE RULES */

// Handles event handlers with the '@' prefix.
EventHandler
  = _ name:SemantqAttributeName _ "=" _ value:EventHandlerValue _ {
      return {
          type: "EventHandler",
          start: location().start.offset,
          end: location().end.offset,
          name: name.name,
          modifiers: name.modifiers,
          expression: value.expression
      };
    }


EventHandlerValue
  = ArrowFunctionAttributeValue
  / MustacheAttributeValue


// Handles two-way binding attributes with the 'bind:' prefix.
TwoWayBindingAttribute "two-way binding attribute"
  = "bind:" propertyName:ExtendedIdentifier _ "=" _ value:AttributeValue {
      if (value.type !== "MustacheAttribute") {
          error("Two-way binding ('bind:') attributes must have a mustache expression value (e.g., {variable}).");
      }
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "TwoWayBindingAttribute",
        name: propertyName.name,
        expression: value.expression
      };
    }

// Handles generic dynamic attributes with a `key={value}` format.
MustacheAttribute
  = _ name:AttributeName _ "=" _ "{" _ expr:MustacheExpression _ "}" {
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "MustacheAttribute",
        name: name.name,
        expression: expr
      };
    }

// Handles standard static attributes with a `key="value"` format.
KeyValueAttribute
  = _ name:AttributeName _ "=" _ value:RegularAttributeValue _ {
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "KeyValueAttribute",
        name: name.name,
        value: [value]
      };
    }

// Handles boolean attributes that are just a name inside curly braces.
BooleanIdentifierAttribute
  = _ "{" _ name: Identifier _ "}" _ {
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "MustacheAttribute",
        name: name.name,
        expression: name
      };
    }

// Handles standalone boolean attributes without a value.
BooleanAttribute
  = _ name:Identifier _ {
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "BooleanAttribute",
        name: name.name,
        value: true
      };
    }


/* SUPPORTING RULES (Identifiers and Values) */

// Defines what constitutes a valid attribute name.
AttributeName
  = ExtendedIdentifier / SemantqAttributeName

// An identifier that allows a broader range of characters for attribute names.
ExtendedIdentifier
  = name:$([a-zA-Z_$][a-zA-Z_0-9\-\:]*) {
    return {
      type: "Identifier",
      start: location().start.offset,
      end: location().end.offset,
      name: name
    };
  }

// A specific identifier for event handlers, starting with '@'.
SemantqAttributeName
  = "@" name:$([a-zA-Z_-]+) {
    return {
      start: location().start.offset,
      end: location().end.offset,
      type: "EventHandler",
      name: name,
      modifiers: []
    };
  }

// Defines the possible types for an attribute's value.
AttributeValue
= IIFE / ArrowFunctionAttributeValue / MustacheAttributeValueWithParams / MustacheAttributeValue / RegularAttributeValue / RegularFunctionalCall

// Parses a value enclosed in curly braces.
MustacheAttributeValue
  = "{" _ expr:MustacheExpression _ "}" {
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "MustacheAttribute",
        expression: expr
      };
    }

// Parses a value enclosed in quotes.
RegularAttributeValue
  = "\"" value:$([^\"]*) "\"" {
      return {
        start: location().start.offset + 1,
        end: location().end.offset - 1,
        type: "Text",
        raw: value,
        data: value
      };
    }


MustacheAttributeValueWithParams
= "{" _ name:Identifier _ "(" _ params:Arguments? _ ")" _ "}" {
    return {
        start: location().start.offset,
        end: location().end.offset,
        type: "MustacheAttributeValueWithParams",
        name: name,
        modifiers: [],
        expression: {
            type: "CallExpression",
            start: location().start.offset,
            end: location().end.offset,
            callee: name,
            arguments: params || [],
            optional: false
        }
    };
}

// Generic identifier for use in expressions.


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




/* --- START ARROW FUNCTION RULES BLOCK --- */

// Defines what can constitute the body of an arrow function.
// It can be a full block statement (e.g., `{ return x + 1; }`)
// or a single expression (e.g., `x + 1`).


ArrowFunctionBody
  = BlockStatement
  / AssignmentExpression
  / FullJSExpression


AssignmentExpression
  = left:LeftHandSideExpression _ operator:AssignmentOperator _ right:AssignmentExpression {
      return {
        type: 'AssignmentExpression',
        operator: operator,
        left: left,
        right: right,
        start: left.start,
        end: right.end
      };
    }
  / UpdateExpression // Add this to handle count++ and similar

AssignmentOperator
  = "="
  / "+="
  / "-="
  / "*="
  / "/="
  / "%="
  / "<<="
  / ">>="
  / ">>>="
  / "|="
  / "^="
  / "&="
  

// Defines the parameters of an arrow function.
// This handles three forms:
// 1. No parameters (empty parentheses): `()`
// 2. Multiple or single parenthesized parameters: `(a, b)` or `(a)`
// 3. Single unparenthesized parameter: `param => ...`


ArrowParameters
  = "(" _ ")" { return []; }  // `()`
  / "(" _ params:ParameterList? _ ")" { return params || []; } // `(a, b)` or `(a)`
  / param:Identifier { return [param]; } // `param => ...`



// Parses a comma-separated list of identifiers for parameters.
ParameterList
  = head:Identifier tail:(_ "," _ Identifier)* {
      return [head, ...tail.map(t => t[3])];
    }

// The main rule for an Arrow Function Expression itself.
// Combines the parsed parameters and body using the `createArrowFunction` helper.


ArrowFunction
  = params:ArrowParameters _ "=>" _ body:ArrowFunctionBody {
      return createArrowFunction(params, body);
    }


/*
 * Rule to integrate Arrow Functions into HTML Attributes.
 * This rule expects the arrow function to be enclosed in `{}` for attribute values,
 * and it wraps the parsed ArrowFunction node into a MustacheAttribute type.
 * This allows syntax like: `@click={ (e) => updateValue(e.target.value) }`
 */

ArrowFunctionAttributeValue "arrow function attribute value"
  = "{" _ arrowExpr:ArrowFunction _ "}" {
      return {
        type: "MustacheAttribute",
        start: location().start.offset,
        end: location().end.offset,
        expression: arrowExpr
      };
    }


/*
 * Integration into the broader JavaScript expression hierarchy.
 * This is crucial for `ArrowFunction` to be recognized wherever
 * a full JavaScript expression is expected (e.g., variable assignments,
 * array methods like `map`, etc.).
 *
 * IMPORTANT: Ensure this `ArrowFunction` alternative is placed appropriately
 * in your `FullJSExpression` rule, generally before `PrimaryExpression`
 * and after other complex expressions like `CallExpression` or `MemberExpression`.
 *
 * Example integration within your FullJSExpression (you will add this line
 * into your existing FullJSExpression definition):
 *
 * FullJSExpression
 * = TernaryExpression
 * / LogicalORExpression
 * / ... (other expressions) ...
 * / CallExpression
 * / MemberExpression
 * / ArrowFunction // <--- Add this line
 * / PrimaryExpression
 * ;
 */

/*
 * Update the 'AttributeValue' rule to include 'ArrowFunctionAttributeValue'.
 * This allows arrow functions to be directly used as attribute values.
 *
 * Example integration within your AttributeValue rule:
 *
 * AttributeValue
 * = IIFE
 * / ArrowFunctionAttributeValue // <--- Add this line
 * / MustacheAttributeValueWithParams
 * / MustacheAttributeValue
 * / RegularAttributeValue
 * / RegularFunctionalCall
 */

/* --- END ARROW FUNCTION RULES BLOCK --- */












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
 = _ contents:((!("@else" / "@endif" / "@endeach") ContentLine) / __)* _ {
  // Flatten and filter valid nodes
  const flattened = contents.flat().filter(x =>
   x && (x.type || (typeof x === 'object' && Object.keys(x).length > 0))
  );
  return flattened;
 }



ContentLine
 = content:(
   LogicBlock // For nested directives
   / OpenCloseTags / SelfClosingTags
   / MustacheTag // { user.name } (Your existing rule for interpolation)
   / CommentBlock //    / TextContent // Plain Text, including newlines, outside of other structures
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
  = text:$([^@{}\n<]+) { // Removed leading/trailing _ (optional whitespace) as the content itself can include space.
                          // The surrounding rules like `InnerContent` will handle optional whitespace between *elements*.
      // Only return null if the text is empty after being captured.
      // We want to preserve spaces, so we only trim if we're checking for *actual* content
      if (text.length === 0) return null; // Or handle empty strings if you want to keep them.

      return {
        type: 'TextNode',
        value: text, // Removed .trim()
        raw: text, // Add a raw value
        start: location().start,
        end: location().end
      };
    }

/* ADD HERE */


Interpolations
= Expression / MustacheTag

MustacheTag
  = "{" _ expr:MustacheExpression _ "}" { // Removed leading and trailing `_`
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
  / PrimaryExpression
  ;



PrefixUpdateExpression
  = operator:("++" / "--") _ argument:LeftHandSideExpression { // <-- Change to LeftHandSideExpression
      return createUpdateExpression(operator, argument, true, location().start.offset, argument.end);
    }

PostfixUpdateExpression
  = argument:LeftHandSideExpression _ operator:("++" / "--") { // <-- Change to LeftHandSideExpression
      return createUpdateExpression(operator, argument, false, argument.start, location().end.offset);
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
  = PrefixUpdateExpression
  / PostfixUpdateExpression
  / LeftHandSideExpression  // Fall through to other expressions


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
  = op:("!" / "+" / "-" / "~" / "typeof" / "void" / "delete") _ argument:PrimaryExpression { // <-- Often PrimaryExpression is sufficient
      return createUnaryExpression(op, argument, location().start.offset, argument.end);
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
  = "'" chars:$[^']* "'" { // Add action block here
      return createNode('Literal', location().start, location().end, {
        value: chars,
        raw: text() // `text()` will capture the matched string including quotes
      });
    }
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
  / PostfixUpdateExpression // Added to handle count++
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

    


// Define FullJSExpression to encompass all possible expression types
FullJSExpression
  = TernaryExpression
  / LogicalORExpression
  / LogicalNullishExpression
  / LogicalANDExpression
  / BitwiseExpression
  / EqualityExpression
  / RelationalExpression
  / AdditiveExpression
  / MultiplicativeExpression
  / PrefixUpdateExpression    // <--- Ensure this is BEFORE Call/Member/Primary
  / UnaryExpression           // (Keep Unary here, it usually has similar precedence to PrefixUpdate)
  / PostfixUpdateExpression
  / UpdateExpression   // <--- Ensure this is BEFORE Call/Member/Primary
  / CallExpression            // (These should come AFTER update/unary expressions)
  / MemberExpression
  / ArrowFunction             // (Keep ArrowFunction after Call/Member and before Primary)
  / PrimaryExpression
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
  / PrefixUpdateExpression // Allow post-fix for bind:value and similar
  / CallExpression
  / Literal
  / NumericLiteral
  / StringLiteral
  / UnaryExpression
  / TernaryExpression
  / LogicalORExpression // Include all logical/binary expressions

    
/* END EACH BLOCK */




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


function createElement(start, end, name, attributes, children) {
  // Flatten and process children
  const processedChildren = Array.isArray(children) 
    ? children.flat().filter(x => x) 
    : children ? [children] : [];
    
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

function createMixedContentNode(parts, start, end) {
  // Filter out empty text nodes
  const validParts = parts.filter(part => 
    part && (part.type !== 'TextNode' || part.value.trim())
  );
  
  if (validParts.length === 1) return validParts[0]; 
 
  
  return {
    type: 'MixedContent',
    start: location().start,
    end: location().end,
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
  = "<!--" content:$((!"-->" .)*) "-->"
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
    return {
      html: {
        start: fragment.start,
        end: fragment.end,
        type: "Fragment",
        children: [fragment]
      }
    };
  }

Fragment
  = fragments:(MustacheTag / LogicBlock / OpenCloseTags / SelfClosingTags / TextNode / CommentBlock)+ {
      return fragments.length === 1 
        ? fragments[0] 
        : createMixedContentNode(fragments);
    }

/*
OpenCloseTags
  = _ openTag:OpenTag _ inner:InnerContent? _ closeTag:CloseTag  _ {
    return createElement(openTag.start, closeTag.end, openTag.name, openTag.attributes, [inner]);
  }
*/

OpenCloseTags
  = _ codeTag:CodeHtmlTag { return codeTag; } // Match code tags first
  / _ openTag:OpenTag _
    (closeTag:CloseTag { // Handle empty elements
      return createElement(openTag.start, closeTag.end, openTag.name, openTag.attributes, []);
    }
    / inner:InnerContent _ closeTag:CloseTag _ { // Normal case for other tags
      return createElement(openTag.start, closeTag.end, openTag.name, openTag.attributes, [inner]);
    })
    

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
  = head:BasicHtmlAttribute tail:(_ BasicHtmlAttribute)* {
      return [head, ...tail.map(t => t[1])];
    }
AttributeTypes
=  ExpressionAttribute / BasicHtmlAttribute 

ExpressionAttribute
= ArrowFunctionCall 

BasicHtmlAttribute
= KeyValueAttribute / BooleanAttribute / BooleanIdentifierAttribute

KeyValueAttribute
  = _ attributeName:AttributeName _ "=" _ attributeValue:AttributeValue _ {
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "Attribute",
        type: "KeyValueAttribute",
        name: attributeName,
        value: [attributeValue]
      }; 
    }
    
BooleanAttribute
= _ name:Identifier _ {
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "Attribute",
        smqtype:"BooleanAttribute",
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



AttributeName
  =  ExtendedIdentifier / SemantqAttributeName
  
 SemantqAttributeName
= "@" name:$([a-zA-Z_-]+) {
  return {
    start: location().start.offset,
    end: location().end.offset,
    type: "EventHandler",
    name: name,
    modifiers: [],
    expression: {
      type: "CallExpression",
      start: location().start.offset,
      end: location().end.offset
    }
  };
}

/*
Identifier
= $([a-zA-Z_$][a-zA-Z_0-9]*)
*/

ExtendedIdentifier
  = $([a-zA-Z_$][a-zA-Z_0-9\-]*) // Include dash '-' in the character set


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
= "{" value:MustacheAttributeValueIdentifier   "}" {
      return {
        start: location().start.offset + 1,  // Adjust to start after the opening quote
        end: location().end.offset - 1,      // Adjust to end before the closing quote
        type: "MustacheAttribute",
        name: value
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
  = CallExpression
  / Identifier
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
  = parts:(HtmlTagWithExpressions / LogicBlock / TextWithExpressions / CommentBlock)* {
      const flattened = parts.flat().filter(x => x);
      return flattened.length === 0
        ? { type: 'EmptyContent' } // Explicit empty node
        : flattened.length === 1 
          ? flattened[0] 
          : {
              type: 'Fragment',
              children: flattened,
              start: flattened[0]?.start || location().start,
              end: flattened[flattened.length-1]?.end || location().end
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
  = _ startToken:"@if" "(" test:Condition ")" _ 
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
      / MustacheTag
      / ConsequentContent
      / TextNode
    ) _ {
      return content;
    }

HtmlTagWithExpressions
  = OpenCloseTags / SelfClosingTags / TextWithExpressions / CommentBlock 

TextWithExpressions
  = parts:(TextPart / MustacheTag / ConsequentContent / CommentBlock  (_ ConsequentContent)*)+ {
      const validParts = parts.flatMap(part => 
        Array.isArray(part) ? part : [part]
      ).filter(part => 
        part && (part.type !== 'TextNode' || part.value.trim())
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

MustacheTag
  = _ "{" _ expr:ChainedIdentifier _ "}" _ {
      return {
        type: 'MustacheTag',
        expression: expr,
        start: location().start,
        end: location().end
      };
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

LogicalORExpression
  = left:ParenthesizedLogicalAND _ "||" _ right:ParenthesizedLogicalOR { return createBinaryExpression(left, "||", right); }
  / LogicalANDExpression


// Then update LogicalANDExpression to chain to BitwiseExpression:
LogicalANDExpression
  = left:ParenthesizedBitwise _ "&&" _ right:ParenthesizedLogicalAND { 
      return createBinaryExpression(left, "&&", right);
    }
  / BitwiseExpression

BitwiseANDExpression
  = left:ParenthesizedEquality _ "&" _ right:BitwiseANDExpression { 
      return createBinaryExpression(left, "&", right); 
    }
  / EqualityExpression
  
  
  BitwiseExpression
  = left:EqualityExpression _ op:(">>>" / "&" / "|" / "^" / "<<" / ">>") _ right:BitwiseExpression {
      return createBinaryExpression(left, op, right);
    }
  / EqualityExpression
  
  // Add parenthesized version
ParenthesizedBitwise
  = BitwiseExpression
  / "(" _ expr:BitwiseExpression _ ")" { return expr; }

// Keep all your existing Parenthesized rules but add:
ParenthesizedBitwiseAND
  = BitwiseANDExpression
  / "(" _ expr:BitwiseANDExpression _ ")" { return expr; }
  
ParenthesizedLogicalOR
  = LogicalORExpression
  / "(" _ expr:LogicalORExpression _ ")" { return expr; }

ParenthesizedLogicalAND
  = LogicalANDExpression
  / "(" _ expr:LogicalANDExpression _ ")" { return expr; }

ParenthesizedEquality
  = EqualityExpression
  / "(" _ expr:EqualityExpression _ ")" { return expr; }

EqualityExpression
  = left:RelationalExpression _ op:("===" /  "!==" / "!=" / "==") _ right:EqualityExpression { return createBinaryExpression(left, op, right); }
  / RelationalExpression

RelationalExpression
  = left:AdditiveExpression _ op:("<=" / ">=" / "<" / ">") _ right:RelationalExpression { return createBinaryExpression(left, op, right); }
  / AdditiveExpression

AdditiveExpression
  = left:MultiplicativeExpression _ op:("+" / "-") _ right:AdditiveExpression { return createBinaryExpression(left, op, right); }
  / MultiplicativeExpression

MultiplicativeExpression 
  = left:PrimaryExpression _ op:("*" / "/" / "%") _ right:MultiplicativeExpression { return createBinaryExpression(left, op, right); }
  / PrimaryExpression

PrimaryExpression
  = 
  CallExpression
  / ChainedIdentifier
  / UnaryExpression
  / "(" _ expr:Condition _ ")" { return expr; }
  / NumericLiteral
  / StringLiteral
  / Literal
  / Identifier 
 

CallExpression
  = callee:Identifier _ "(" args:ArgumentList? _ ")" _ {
      return createCallExpression(callee, args);
    }

UnaryExpression
  = "!" (_ / __) argument:PrimaryExpression { 
      return createNode('UnaryExpression', location().start, location().end, {
        operator: "!",
        argument: argument,
        prefix: true
      });
    }
    
    
  ArgumentList
  = head:Condition tail:(_ "," _ Condition)* { 
      return [head, ...tail.map(t => t[3])];
    }
  / _ { return []; }  // Empty args
  
  

Identifier
  = name:$([a-zA-Z_][a-zA-Z0-9_]*) {
      return createNode('Identifier', location().start, location().end, { 
        name: name 
      });
    }

NumericLiteral
  = value:$[0-9]+ {
      return createNode('Literal', location().start, location().end, {
        value: parseInt(value, 10),
        raw: value
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

StringLiteral
  = "'" chars:$[^']* "'" 
  / '"' chars:$[^"]* '"' {
      return createNode('Literal', location().start, location().end, {
        value: chars,
        raw: text()
      });
    }
  /* START CONSEQUENT */
  
  

ConsequentContent 
  = "{" _ expr:(TernaryExpression / ArrowFunction / EachStatement) _ "}" { 
      return createConsequentExpression(expr);
    }
  
    
    
  ConsequentExpression
  = 
  ArrowFunction
  / TernaryExpression
  / ExistingExpression 
  

// Reuse all existing expression rules through this proxy rule
ExistingExpression
  = LogicalORExpression  // This automatically includes all lower precedence rules
                         // via your existing expression hierarchy

// Only need to add these new rules:
// Then update your grammar:
TernaryExpression
  = test:ExistingExpression _ "?" _ consequent:ConsequentExpression _ ":" _ alternate:ConsequentExpression {
      // Ensure we have valid locations
      if (!test.start || !alternate.end) {
        error('Invalid positions in ternary expression');
      }
      return createConditionalExpression(test, consequent, alternate);
    }
    
ArrowFunction
  = params:ArrowParameters _ "=>" _ body:ArrowBody {
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
  = "{" _ body:ConsequentExpression _ "}" {
      if (!body) error('Empty arrow function body');
      return body;
    }
  / body:(ValidExpression / StringLiteral) {  // Add StringLiteral directly
      if (!body) error('Invalid arrow function body');
      return body;
    }

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


/*
JSExpression
  = identifier:Identifier
  / identifier:Identifier _ "." property:Identifier { // to capture property access like item.id
      return { type: 'PropertyAccess', base: identifier, property };
  }
*/

JSExpression
  = ChainedIdentifier
  / Identifier
    
/* END EACH BLOCK */




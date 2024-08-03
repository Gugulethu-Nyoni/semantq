/*

If Statement grammar with consequent body


@if (condition_expression) 


@endif



condition_expression takes the following expression types

1. Boolean Literals 

if (true) or if (false) or if (variable)

or identifier 

2. Comparisons 

if (a == b)


if (a === b)


3. Logical Operators

if (a > 0 && b < 10)

if (a > 0 || b < 10)


4. Type Checks


if (typeof a === 'string')

5. instanceof Array


if (a instanceof Array) 

6. Object Property  Checks

a.
if (obj.hasOwnProperty('property'))

b.

if ('property' in obj)

7. Nullish Coalescing

a.
if ((value ?? 'default') === 'default')

b.
if (value ?? 'default')

8. Optional Chaining

if (obj?.property)


9. Function Calls


if (isAvailable())

10. String Comparisons
if (str1 === str2)

11. Array and Object Checks

if (array.length > 0)


12. Bitwise Operators

if ((flags & 1) !== 0)

13. Regular Expressions

if (/test/.test(string))

if (input.match(regex))


*/


{
  function createLiteral(value) {
    return {
      type: "Literal",
      value: value,
      raw: text().slice(location().start.offset, location().end.offset)
    };
  }

  function createIfStatement(test, consequent) {
  return {
    type: "IfStatement",
    test: {
      type: test.type,
      start: test.start,
      end: test.end,
      left: test.left,
      operator: test.operator,
      right: test.right
    },
    consequent: consequent,
    alternate: null
  };
}

  function createProgram(body) {
    return {
      type: "Program",
      body: body,
      sourceType: "module"
    };
  }
  
  
  function createIdentifier(name) {
    return {
      type: "Identifier",
      name: name,
      start: location().start.offset,
      end: location().end.offset
    };
  }

  function createBinaryExpression(left, operator, right) {
    return {
      type: "BinaryExpression",
      left: left,
      operator: operator,
      right: right,
      start: location().start.offset,
      end: location().end.offset
    };
  }

  
  /* START CONSEQUENT HELPERS */
  
  function createFragment(start, end, children) {
    return {
      start,
      end,
      type: "Fragment",
      children
    };
  }

  function createText(start, end, raw) {
    return {
      start,
      end,
      type: "Text",
      raw,
      data: raw.trim()
    };
  }
  
  function createTextNode(text, start, end) {
    return {
      start: start.offset,
      end: end.offset,
      type: "Text",
      raw: text,
      data: text
    };
  }

  function createElement(start, end, name, attributes, children) {
    return {
      start,
      end,
      type: "Element",
      name,
      attributes,
      children
    };
  }
  
  
  
  function createIdentifier(name, start, end, loc) {
    return {
      type: "Identifier",
      start: start,
      end: end,
      loc: loc,
      name: name
    };
  }

/* TERNARY EXPRESSION HELPER */

// Helper function to create nodes
  function createNode(type, location, value) {
    return {
      type: type,
      start: location.start,
      end: location.end,
      value: value
    };
  }
  
  
  
  /* END CONSEQUENT HELPERS */
  
  
  
  
}





Program
  = _ statement:IfStatement _ {
      return createProgram([statement]);
    }

IfStatement
= "@if" _ "(" _ test:Condition _ ")" _ consequent:Consequent _ "@endif" {
  const testStart = test.start;
  const testEnd = test.end;
  const testLoc = test.loc;
  const testName = test.name;
  const testLeft = test.left;
  const testOperator = test.operator;
  const testRight = test.right;
  return createIfStatement({
    type: test.type,
    start: testStart,
    end: testEnd,
    loc: testLoc,
    name: testName,
    left: testLeft,
    operator: testOperator,
    right: testRight
  }, consequent);
}


Condition
  = RegularExpressionCheck / OptionalChaining / ArrayLengthCheck / BitwiseExpression / NullishCoalescing / LogicalExpression / ObjectCheck / TypeofExpression / InstanceofExpression / CallExpression / TrueOrFalseLiteral / BinaryExpression / StringComparison / InExpression / Identifier 
  
  
TrueOrFalseLiteral
= trueLiteral / falseLiteral 

trueLiteral
  = value:"true" {
      return createLiteral(true);
    }
    
 falseLiteral
  = value:"false" {
      return createLiteral(false);
    }
    
 BinaryExpression
  = left:Identifier _ operator:("<=" / ">=" / "===" / "==" / "!=" / "!==" / "<" / ">"  ) _ right:Identifier {
      return createBinaryExpression(left, operator, right);
    }

StringComparison
  = left:Identifier _ operator: ("!==" / "===" / "==" / "!=" / ">" / ">=" / "<" / "<=" / "!==") _ right:Identifier {
      return {
        type: "BinaryExpression",
        left: left,
        operator: operator,
        right: right,
        start: location().start.offset,
        end: location().end.offset
      };
    }


Identifier
  = name:$([a-zA-Z0-9_])+ {
      return createIdentifier(name);
    }
    
   
LogicalExpression
  = left:(ObjectCheck / TypeofExpression / InstanceofExpression / CallExpression / Literal / BinaryExpression) _ operator:("&&" / "||") _ right:Condition {
      return {
        type: "LogicalExpression",
        left: left,
        operator: operator,
        right: right
      };
    }
 
 
 TypeofExpression
  = "typeof" _ argument:Identifier _ operator:"===" _ value:stringLiteral {
      return {
        type: "BinaryExpression",
        left: {
          type: "UnaryExpression",
          operator: "typeof",
          prefix: true,
          argument: argument
        },
        operator: operator,
        right: {
          type: "Literal",
          value: value,
          raw: value
        }
      };
    }

/*
stringLiteral
  = "'" string:"string" "'" {
      return string;
    }
*/


InstanceofExpression
  = argument:Identifier _ operator:"instanceof" _ instClass:instanceOfClass {
      return {
        type: "BinaryExpression",
        left: argument,
        operator: operator,
        right: instClass
      };
    }

instanceOfClass
  = "Array" {
      return {
        type: "Identifier",
        name: "Array"
      };
    }


CallExpression
  = callee:Identifier _ "(" _ ")" {
      return {
        type: "CallExpression",
        callee: callee,
        arguments: [],
        optional: false
      };
    }


ObjectCheck
  = object:Identifier _ "." _ "hasOwnProperty" _ "(" _ "'" property:Identifier "'" _ ")" {
      return {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: object,
          property: {
            type: "Identifier",
            name: "hasOwnProperty"
          },
          computed: false,
          optional: false
        },
        arguments: [
          {
            type: "Literal",
            value: property.name,
            raw: `'${property.name}'`
          }
        ],
        optional: false
      };
    }



ArrayLengthCheck
= "array" _ "." _ "length" _ operator:comparisonOperator _ value:Literal {
  return {
    type: "BinaryExpression",
    start: location().start.offset,
    end: location().end.offset,
    left: {
      type: "MemberExpression",
      start: location().start.offset,
      end: location().end.offset,
      object: {
        type: "Identifier",
        start: location().start.offset,
        end: location().start.offset + 5,
        name: "array"
      },
      property: {
        type: "Identifier",
        start: location().start.offset + 6,
        end: location().end.offset,
        name: "length"
      },
      computed: false,
      optional: false
    },
    operator: operator,
    right: value
  };
}

NullishCoalescing
  = NullishCoalescingExpression / NullishCoalescingBinaryExpression

NullishCoalescingExpression
  = left:Identifier _ "??" _ right: stringLiteral {
      return {
        type: "LogicalExpression",
        left: left,
        operator: "??",
        right: right
      };
    }

NullishCoalescingBinaryExpression
  = "(" _ left:Identifier _ "??" _ right:Literal _ ")" _ operator:("===" / "==") _ rightValue:Literal {
      return {
        type: "BinaryExpression",
        left: {
          type: "LogicalExpression",
          left: left,
          operator: "??",
          right: right
        },
        operator: operator,
        right: rightValue
      };
    }

Literal
  = stringLiteral / numberLiteral / booleanLiteral / nullLiteral


stringLiteral
  = "'" value:$([^']*) "'" {
      return {
        type: "Literal",
        value: value,
        raw: "'" + value + "'"
      };
    }


numberLiteral
  = value:$([0-9]+) {
      return {
        type: "Literal",
        value: parseInt(value, 10),
        raw: value
      };
    }

booleanLiteral
  = value:("true" / "false") {
      return {
        type: "Literal",
        value: value === "true",
        raw: value
      };
    }

nullLiteral
  = "null" {
      return {
        type: "Literal",
        value: null,
        raw: "null"
      };
    }

BitwiseExpression
= BitwiseComplex / BitwiseBinary

BitwiseBinary
  = left:Identifier _ operator:("&" / "|" / "^") _ right:Literal {
      return {
        type: "BinaryExpression",
        left: left,
        operator: operator,
        right: right,
        start: location().start.offset,
        end: location().end.offset
      };
    }

BitwiseComplex
  = "(" _ left:BitwiseBinary _ ")" _ operator:("!==" / "<=" / ">=" / "===" / "==" / "!=" / "<" / ">") _ right:Literal {      return {
        type: "BinaryExpression",
        left: {
          type: "BinaryExpression",
          left: left.left,
          operator: left.operator,
          right: left.right
        },
        operator: operator,
        right: right,
        start: location().start.offset,
        end: location().end.offset
      };
    }


OptionalChaining
= obj:Identifier _ "?" _ "." _ property:Identifier {
  return {
    type: "ChainExpression",
    expression: {
      type: "MemberExpression",
      object: obj,
      property: property,
      computed: false,
      optional: true
    }
  };
}


RegularExpressionCheck
= RegexTestDotMethod / RegexTestSlashNotation


RegexTestDotMethod
= object:Identifier _ "." _ method:"match" _ "(" _ regex:Identifier _ ")" {
      return {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: object,
          property: {
            type: "Identifier",
            name: "match"
          },
          computed: false,
          optional: false
        },
        arguments: [regex],
        start: object.start,
        end: regex.end
      };
    }



RegexTestSlashNotation
  = "/" regex:RegexLiteral "/" _ "." _ "test" _ "(" _ string:Identifier _ ")" {
      return {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: {
            type: "Literal",
            value: regex.value,
            raw: "/" + regex.value + "/",
            regex: {
              pattern: regex.value,
              flags: ""
            }
          },
          property: {
            type: "Identifier",
            name: "test"
          },
          computed: false,
          optional: false
        },
        arguments: [
          {
            type: "Identifier",
            name: string.name
          }
        ],
        optional: false
      };
    }

RegexLiteral
  = pattern:$([^/]*) {
      return { value: pattern };
    }
    
    
InExpression
  = left:Literal _ "in" _ right:Identifier {
      return {
        type: "BinaryExpression",
        operator: "in",
        left: left,
        right: right
      };
    }


  

 comparisonOperator
  = "<="
  / ">="
  / "==="
  / "=="
  / "!="
  / "!=="
  / "<"
  / ">"


_ "whitespace"
  = [ \r\t\n]*

__ "whitespace"
  = [ \r\t\n]+


/* START CONSEQUENT BLOCK */



Consequent
  =  ExpressionStatements // TextNode / HTML / 

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
  = TextNode / OpenCloseTags / SelfClosingTags

OpenCloseTags
  = _ openTag:OpenTag inner:InnerContent closeTag:CloseTag  _ {
    return createElement(openTag.start, closeTag.end, openTag.name, openTag.attributes, [inner]);
  }

SelfClosingTags
  = openTag:SelfClosingTag {
    return createElement(openTag.start, openTag.end, openTag.name, openTag.attributes, []);
  }

OpenTag
  = "<" tagName:TagName _ attributes:Attributes? _ ">" {
    return { start: location().start.offset, end: location().end.offset, name: tagName, attributes };
  }

CloseTag
  = "</" tagName:TagName _ ">" {
    return { start: location().start.offset, end: location().end.offset, name: tagName };
  }

SelfClosingTag
  = _ "<" tagName:TagName _ attributes:Attributes? _ "/>" _ {
    return { start: location().start.offset, end: location().end.offset, name: tagName, attributes };
  }

TagName
  = name:$([a-zA-Z0-9]+) { return name; }


/* START ATTRIBUTE BLOCK */



Attributes
  = head:BasicHtmlAttribute tail:(_ BasicHtmlAttribute)* {
      return [head, ...tail.map(t => t[1])];
    }
AttributeTypes
= BasicHtmlAttribute 


BasicHtmlAttribute
  = _ attributeName:AttributeName _ "=" _ attributeValue:AttributeValue _ {
      return {
        start: location().start.offset,
        end: location().end.offset,
        type: "Attribute",
        name: attributeName,
        value: [attributeValue]
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
    } / "" ;
    
    
MustacheAttributeValue
= "{" value:Identifier "}" {
      return {
        start: location().start.offset + 1,  // Adjust to start after the opening quote
        end: location().end.offset - 1,      // Adjust to end before the closing quote
        type: "MustacheAttribute",
        name: value
      };
    }
  
  
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
= "\"" name:Identifier "\"" "(" MultipleArguments? ")" {
  return {
    start: location().start.offset,
    end: location().end.offset,
    type: "RegularFunctionalCall",
    name: name
  };
}


ArrowFunctionCall
= "{" _"()" _ "=>" _ identifier:Identifier  "(" params:MultipleArguments? ")" "}" {
  return {
    type: "ArrowFunctionCall",
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
    identifier: identifier,
    params: params || [],
  };
}


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

  


/* END ATTRIBUTE BLOCK */



InnerContent
= fragment:Fragment* { return fragment; }

TextNode
  = text:$([a-zA-Z0-9 ]+) {
      const loc = location();
      return createTextNode(text, loc.start, loc.end);
    }
    
    
 ExpressionStatements
 = TernaryExpression
   /* START TERNARY OPERATOR */
   
   

 TernaryExpression
 =  "{" _ condtion:Condition _ "?" _ trueValue:ExpressionStatement _ ":" _ falseValue:ExpressionStatement _ "}";
  
  ExpressionStatement
  = expression:LiteralExpression {
    const loc = location();
    return {
      type: "ExpressionStatement",
      start: loc.start,
      end: loc.end,
      expression: expression
    };
  }

LiteralExpression
  = StringLiteral
  / NumericLiteral
  / BooleanLiteral
  / NullLiteral

NumericLiteral
  = digits:$(Digit+) {
    const loc = location();
    return createNode("NumericLiteral", loc, parseInt(digits, 10));
  }

StringLiteral
  = '"' chars:$(Character*) '"' {
    const loc = location();
    return createNode("StringLiteral", loc, chars);
  }
  / "'" chars:$(Character*) "'" {
    const loc = location();
    return createNode("StringLiteral", loc, chars);
  }
  / chars:$(UnquotedCharacter+) {
    const loc = location();
    return createNode("StringLiteral", loc, chars);
  }

UnquotedCharacter
  = [a-zA-Z_]



BooleanLiteral
  = "true" {
    const loc = location();
    return createNode("BooleanLiteral", loc, true);
  }
  / "false" {
    const loc = location();
    return createNode("BooleanLiteral", loc, false);
  }

NullLiteral
  = "null" {
    const loc = location();
    return createNode("NullLiteral", loc, null);
  }

Digit
  = [0-9]

Character
  = [^\\"\']


/* END TERNARY OPERATOR */
   

/* END CONSEQUENT BLOCK */




{


  function parseArrayLiteral(elements) {
    return { type: 'array_literal', elements };
  }
  
  
  function createNode(type, properties) {
    return {
      type,
      properties,
      location: { ...properties.location, source: ""}
    };
  }

/*
  function joinChunks(chunks) {
    return chunks.join('');
  }
  */
  
}

/* grammar for


@if (a >= b) 
    <div class="main" id="2324" @click={increment} @mouseover={do} > 
        <h1> <p> let's go </p> </h1> 
    </div> 
@endif

@if (a === n)  

<button @click={clickHandler}> Hi {name} {obj.name} {name} {arr[0]} {bar.baz()} {((2 + 3) * 4 - 1) / 2 ^ 3 + 10 - 5}  </h3> 
@endif



TODOs:

1. Allow plain text in the codeToRun block 
2. Enforce white space before closingBlock @endif
4. check how far html nestability can go / test with span  
3. add more js condtion expressions - full list 

javascript_condition
  = boolean_value 
    / comparison
    / identifier 
    / negated_identifier 
    / array_includes ;
    
*/

/*
start
  = _ programBody:openCloseHtmlTag _ { return createNode("Program", { body: programBody, sourceType: "module" }); }
*/



start
  = if_statement

if_statement
  = "@if" _ "(" _ condition:condition _ ")" _ codeToRun:codeToRun _ "@endif"
  {
    return createNode("IfStatement", {
     type: "IfStatement",
      test: condition,
      consequent: codeToRun,
      alternate: null
    });
  }

condition
  = javascript_condition

javascript_condition
  = boolean_value
    / comparison
    / identifier
    / negated_identifier
    / array_includes
    {
      return {
        type: "Identifier",
        value: javascript_condition.value
      };
    }

value
  = identifier
    / string_literal
    / numeric_literal
    / boolean_value;
    

identifier
= [a-zA-Z_][a-zA-Z_0-9]* { return { type: 'identifier', value: text() } }

numeric_literal
  = [0-9]+ ("." [0-9]+)? { return { type: 'numeric_literal', value: parseFloat(text()) }; }

boolean_value
  = "true" { return { type: 'boolean_literal', value: true }; }
  / "false" { return { type: 'boolean_literal', value: false }; }

string_literal
  = "'" [^']* "'" { return { type: 'string_literal', value: text().slice(1, -1) }; }
  / '"' [^"]* '"' { return { type: 'string_literal', value: text().slice(1, -1) }; }



comparison
= left:value __ operator:("<=" / ">=" / "==="/ "!==" / ">" / "<" / "==" / "!=") __ right:value { return {left:left, operator:operator, right:right } }

negated_identifier
="!" identifier;

array_includes
=array_literal method_call parenthesized_token;

array_literal
  = "[" _ elements:(value ("," _ value)*)? "]" {
      return parseArrayLiteral(elements ? [elements[0], ...elements[1].map(e => e[2])] : []);
    }

method_call
="." "includes" { return {type:"method_call", method:".includes" } }

parenthesized_token
="(" _ token:value _ ")" { return { type:"parenthesized_token", openingParens: "(", token:token, closingParens:")" } } 


conditionCloseParen
=_")" { return {type:"conditionOpenParen", tag:")" } }


codeToRun
= html_block // / customSyntax  / plain_text;


html_block
= openCloseHtmlTag / selfClosingHtmlTag; 

openCloseHtmlTag
=htmlOpeningTag _ tagContent _ htmlClosingTag _;

tagContent
= regular_html / customSyntax; 

htmlOpeningTag
= _ openingFragment tag htmlAttribute?  _ closingFragment _ ;

openingFragment
=fragment: "<" { return {type: "openingFragment", fragment: fragment} }

tag
=tag:$([a-zA-Z][1-6]?)+ { return {type:"tag", tagName:tag} }

htmlAttribute
= (regularAttribute / customAttribute)* _?

/* START REGULAR ATTRIBUTE */

regularAttribute
= attributeName attributeEquals attributeValueOpenQuote attributeVal? attributeValueCloseQuote;

attributeName
  = __ name:$([a-zA-Z_][a-zA-Z0-9_\-]+) { return { type: "attributeName", value: name }; }

attributeEquals
="=" { return{type:"attributeEquals", value:"="} }

singleQuote
=singleQuote:"'" { return{type:"singleQuote", value:singleQuote}}


doubleQuote
=doubleQuote:'"' { return{type:"doubleQuote", value:doubleQuote}}

attributeValueOpenQuote
=singleQuote / doubleQuote;


attributeVal
= chars:$([a-zA-Z0-9_\-:@]+) { return { type: "string", value: chars }; }

attributeValueCloseQuote
= attributeValueOpenQuote;


/* END REGULAR ATTRIBUTE */




/* START CUSTOM ATTRIBUTE BLOCK */


customAttribute
= customAttrOpeningTag customAttrEvent attributeEquals funcCallOpenTag functionCall funcCallCloseTag;

customAttrOpeningTag
= tag: __"@" { return {type:"customAttrOpeningTag", value:"@" } }


customAttrEvent
  = eventName:$([a-zA-Z]+) {
      return {
        type: "customAttrEvent",
        value: eventName
      };
    }



funcCallOpenTag
= "{";

functionCall
= functionCall:$([a-zA-Z_$][a-zA-Z0-9_$]+) { return {type:"functionCall", value: functionCall } }

funcCallCloseTag
="}";


/* END CUSTOM ATTRIBUTE */
closingFragment
=fragment: ">" { return {type: "closingFragment", fragment: fragment} }

/*
plain_text
=plain_text:$([^<>]+) { return{type:"plain_text", plain_text: plain_text} }
*/

plain_text
  = plain_text:$([a-zA-Z0-9_! \t\r\n-]+) {
      return { type: "plain_text", plain_text: plain_text };
    }

htmlClosingTag
=openingFragment forwardSlash tag closingFragment;

forwardSlash
=symbol:"/" { return{type: "forwardSlash", symbol:symbol } }

// block for regular_htm

regular_html
= customSyntax / plain_text / codeToRun* ; 


// 
selfClosingHtmlTag
= _ openingFragment tag htmlAttribute? _ selfClosingFragment _ ;

selfClosingFragment
=fragment: "/>" { return {type: "closingFragment", fragment: fragment} }



/* CUSTOM SYNTAX  */
 
/*

test with: {foo()} {obj.name} {name} {arr[0]} {bar.baz()} {((2 + 3) * 4 - 1) / 2 ^ 3 + 10 - 5}

*/

customSyntax
= (expression _)+

expression
= binding / functionCall / propertyAccess / arithmeticExpression

binding
= variable / objectProperty / arrayAccess

variable
= "{" _ name:identifier _ "}" {
  return createNode("Variable", {name: name, location: location() });
}

objectProperty
= "{" _ obj:identifier _ "." _ prop:identifier _ "}" {
  return createNode("ObjectProperty", {
    object: obj,
    property: prop,
    location: location()
  });
}

arrayAccess
= "{" _ arr:identifier _ "[" _ index:integer _ "]" _ "}" {
  return createNode("ArrayAccess", {
    array: arr,
    index: index,
    location: location()
  });
}

integer
= digits:$([0-9]+) {
  return createNode("Integer", {
    value: parseInt(digits, 10),
    location: location()
  });
}

/*
identifier
= name:$([a-zA-Z_$][a-zA-Z0-9_$]*) {
  return createNode("Identifier", {
    name: name,
    location: location()
  });
}
*/

functionCallCS
= "{" _ name:identifier _ "(" _ args:(expression (_ "," _ expression)*)? _ ")" _ "}" {
  return createNode("FunctionCall", {
    name: name,
    arguments: args ? [args[0], ...args[1].map(arg => arg[3])] : [],
    location: location()
  });
}

propertyAccess
= "{" _ obj:identifier _ "." _ prop:identifier _ "(" _ args:(expression*)? _ ")" _ "}" {
  return createNode("PropertyAccess", {
    object: obj,
    property: prop,
    arguments: args,
    location: location()
  });
}

arithmeticExpression
= "{" _ expr:expressionOrArithmetic _ "}" {
  return createNode("ArithmeticExpression", {
    expression: expr,
    location: location()
  });
}

expressionOrArithmetic
= arithmeticExpressionContent

arithmeticExpressionContent
= additionSubtraction

additionSubtraction
= left:multiplicationDivision _ op:addSubOperator _ right:additionSubtraction {
  return createNode("BinaryExpression", {
    operator: op,
    left: left,
    right: right,
    location: location()
  });
}
/ multiplicationDivision

multiplicationDivision
= left:exponentiation _ op:mulDivOperator _ right:multiplicationDivision {
  return createNode("BinaryExpression", {
    operator: op,
    left: left,
    right: right,
    location: location()
  });
}
/ exponentiation

exponentiation
= left:primary _ op:expOperator _ right:exponentiation {
  return createNode("BinaryExpression", {
    operator: op,
    left: left,
    right: right,
    location: location()
  });
}
/ primary

primary
= integer
/ identifier
/ "(" _ expr:additionSubtraction _ ")" {
  return expr;
}

addSubOperator
= "+" / "-"

mulDivOperator
= "*" / "/" / "%"

expOperator
= "^"


logicalOperator
= "&&" _ { return createNode("LogicalAnd"); }
/ "||" _ { return createNode("LogicalOr"); }
/ "!" _ { return createNode("LogicalNot"); }



comparisonOperator
= "<" _ { return createNode("LessThan"); }
/ ">" _ { return createNode("GreaterThan"); }
/ "<=" _ { return createNode("LessThanEqual"); }
/ ">=" _ { return createNode("GreaterThanEqual"); }
/ "==" _ { return createNode("Equal"); }
/ "!=" _ { return createNode("NotEqual"); }
 
 
 
 
 
 // required white space
__ 
=[ \t\r\n]+;

// optional white space 

_
=[ \t\r\n]*;
 
 
/*

test with: {foo()} {obj.name} {name} {arr[0]} {bar.baz()} {((2 + 3) * 4 - 1) / 2 ^ 3 + 10 - 5}

*/

{
  function createNode(type, properties) {
    return {type, ...properties, location: {...properties.location, source: ""}};
  }
}

start
= _ programBody:customSyntax _ { return createNode("Program", {body: programBody, sourceType: "module"}) }

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

identifier
= name:$([a-zA-Z_$][a-zA-Z0-9_$]*) {
  return createNode("Identifier", {
    name: name,
    location: location()
  });
}

functionCall
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

// Rules for handling whitespace.
_
= [ \t\r\n]*;

__
= [ \t\r\n]+;

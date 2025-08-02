### 1. Text Interpolations (Mustache Tags and Expressions)
```
MustacheTag
└─ MustacheExpression (FullJSExpression)
   ├─ TernaryExpression
   │  ├─ LogicalORExpression
   │  │  ├─ LogicalNullishExpression
   │  │  │  ├─ LogicalANDExpression
   │  │  │  │  ├─ BitwiseExpression
   │  │  │  │  │  ├─ EqualityExpression
   │  │  │  │  │  │  ├─ RelationalExpression
   │  │  │  │  │  │  │  ├─ AdditiveExpression
   │  │  │  │  │  │  │  │  ├─ MultiplicativeExpression
   │  │  │  │  │  │  │  │  │  ├─ LeftHandSideExpression
   │  │  │  │  │  │  │  │  │  │  ├─ CallExpression
   │  │  │  │  │  │  │  │  │  │  ├─ MemberExpression
   │  │  │  │  │  │  │  │  │  │  ├─ PostfixUnaryExpression
   │  │  │  │  │  │  │  │  │  │  └─ PrimaryExpression
   │  │  │  │  │  │  │  │  │  └─ UnaryExpression
   │  │  │  │  │  │  │  │  └─ UpdateExpression
   │  │  │  │  │  │  │  └─ ParenthesizedExpressions
   │  │  │  │  │  │  └─ Literals
   │  │  │  │  │  │     ├─ NumericLiteral
   │  │  │  │  │  │     ├─ StringLiteral
   │  │  │  │  │  │     ├─ ArrayLiteral
   │  │  │  │  │  │     └─ ObjectLiteral
   │  │  │  │  │  └─ Identifier
   │  │  │  │  └─ ChainedIdentifier
   │  │  │  └─ TemplateLiteral
   │  │  └─ ArrowFunctionExpression
   │  └─ IIFE
   └─ ConsequentExpression
```

### 2. Attribute Directives
```
Attribute
├─ BasicHtmlAttribute
│  ├─ TwoWayBindingAttribute
│  ├─ KeyValueAttribute
│  │  └─ EventHandler (@click etc.)
│  ├─ BooleanAttribute
│  └─ BooleanIdentifierAttribute
└─ ExpressionAttribute
   ├─ ArrowFunction
   │  ├─ ArrowParameters
   │  └─ ArrowFunctionBody
   ├─ MustacheAttributeValue
   │  └─ MustacheExpression (same hierarchy as above)
   ├─ MustacheAttributeValueWithParams
   │  └─ CallExpression
   ├─ RegularFunctionalCall
   └─ IIFE
```

### 3. Logic Blocks
```
LogicBlock
├─ IfStatement
│  ├─ Condition (LogicalORExpression)
│  ├─ Consequent (ContentBody)
│  │  ├─ HtmlTagWithExpressions
│  │  ├─ TextWithExpressions
│  │  ├─ MustacheTag
│  │  └─ Nested LogicBlocks
│  └─ Alternate (@else content)
└─ EachStatement
   ├─ EachSource
   │  ├─ JSExpression (iterable)
   │  ├─ Identifier (item)
   │  └─ JSExpression? (key)
   └─ ContentBody
      ├─ HtmlTagWithExpressions
      ├─ TextWithExpressions
      ├─ MustacheTag
      └─ Nested LogicBlocks
```

### Notes
1. **Expression Hierarchy** is shared across all categories, with `FullJSExpression` at the root
2. **Attribute Types** have special handling for event bindings (@) and two-way bindings (bind:value)
3. **Logic Blocks** can nest other logic blocks and share the same content parsing rules
4. **MustacheTags** and attribute expressions ultimately resolve to the same expression types

The grammar shows sophisticated handling of:
- Complex expressions in text interpolations (up to ternary operations)
- Flexible attribute syntax with both simple values and full JS expressions
- Nested logic blocks with proper scoping
- Special cases like arrow functions and IIFEs in attributes


{
  function parseArrayLiteral(elements) {
    return { type: 'array_literal', elements };
  }

/*
  function joinChunks(chunks) {
    return chunks.join('');
  }
  */
  
}

/* grammar for


@if (condition)

html 

@endif 

TODOs:
1. add more js condtion expressions - full list 
2. Allow plain text in the codeTorun block 
3. Enforce white space before closingBlock @endif
*/



start
  = if_block*

if_block
  = openingBlock codeToRun closingBlock;

openingBlock
  = openingTag conditionOpenParen condition conditionCloseParen; ///closingElement; 

openingTag
  = openingFragment: "@if" __ { return { type: "if_block", tag: openingFragment }; }

conditionOpenParen
=_"("_ { return {type:"conditionOpenParen", tag:"(" } }


//White spaces

// required white space 
__
  = [ \t\r\n]+


//optional white space
_
  = [ \t\r\n]*

condition
  = javascript_condition;

javascript_condition
  = boolean_value 
    / comparison
    / identifier 
    / negated_identifier 
    / array_includes ;


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


/*
plain_text
  = content:$[^<]* { return { type: 'plain_text', content: content } }
*/


comparison
= left:value __ operator:("==="/ "!==" / ">" / "<" / ">=" / "<=" / "==" / "!=") __ right:value { return {left:left, operator:operator, right:right } }

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



/* codeToRun Block */

/* GRAMMAR FOR 
// html tags (nestable) with attributes 

<h1 id="353" class="main" data-bding="@go"> <p class="par">  </p> </h1>

// and self closing html tags
<hr />

*/



codeToRun
=openCloseHtmlTag / selfClosingHtmlTag;

openCloseHtmlTag
=htmlOpeningTag _ regular_html _ htmlClosingTag _;

htmlOpeningTag
= _ openingFragment tag htmlAttribute?  _ closingFragment _ ;

openingFragment
=fragment: "<" { return {type: "openingFragment", fragment: fragment} }

tag
=tag:$([a-zA-Z][1-6]?)+ { return {type:"tag", tagName:tag} }

htmlAttribute
=attrBlock* _ ;

attrBlock
= attributeName attributeEquals attributeValueOpenQuote attributeVal attributeValueCloseQuote;

attributeName
  = __ name:$([a-zA-Z_][a-zA-Z0-9_\-]*) { return { type: "attributeName", value: name }; }

attributeEquals
="=" { return{type:"attributeEquals", value:"="} }

singleQuote
=singleQuote:"'" { return{type:"singleQuote", value:singleQuote}}


doubleQuote
=doubleQuote:'"' { return{type:"doubleQuote", value:doubleQuote}}

attributeValueOpenQuote
=singleQuote / doubleQuote;// { return{type:"attributeValueOpenQuote", value:quote}}


attributeVal
= chars:$([a-zA-Z0-9_\-:@]*) { return { type: "string", value: chars }; }

attributeValueCloseQuote
= attributeValueOpenQuote; // { return{type:"attributeValueCloseQuote", value:quote}}


closingFragment
=fragment: ">" { return {type: "closingFragment", fragment: fragment} }

plain_text
=plain_text:$([^<>]+) { return{type:"plain_text", plain_text: plain_text} }

htmlClosingTag
=openingFragment forwardSlash tag closingFragment;

forwardSlash
=symbol:"/" { return{type: "forwardSlash", symbol:symbol } }

// block for regular_htm

regular_html
= plain_text / codeToRun*;


// 
selfClosingHtmlTag
= _ openingFragment tag htmlAttribute? _ selfClosingFragment _ ;

selfClosingFragment
=fragment: "/>" { return {type: "closingFragment", fragment: fragment} }


// IF CLOSING TAG @endif
closingBlock
=  closingTag: $( _"@endif") { return { type:"closingBlock", value:closingTag } } 





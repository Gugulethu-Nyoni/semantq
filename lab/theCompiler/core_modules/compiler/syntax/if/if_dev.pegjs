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


start
  = if_block*

if_block
  = openingBlock __ codeToRun __ closingBlock;

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


plain_text
  = content:$[^<]* { return { type: 'plain_text', content: content }; }

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

codeToRun
  =regular_html; // regular_js;// /  / custom_syntax;

regular_html
  = _ self_closing_tag / open_close_html_tag_with_content / plain_text _ ;

self_closing_tag
  =_ "<" tag_name:identifier attributes:(attribute)* "/>" _;
  
regular_html_opening_tag
  = _ "<" tag_name:identifier attributes:(attribute)* ">" _;
  
regular_html_closing_tag
 = _ "<" tag_name:identifier "/>" _;

attribute
  = __ identifier "=" value _;
  
 
 open_close_html_tag_with_content
 = _ regular_html_opening_tag _ regular_html _ regular_html_closing_tag _; 


closingBlock
  = closingTag

closingTag
  = _ "@endif" _ { return { type: "closing_block", tag: "@endif" }; }







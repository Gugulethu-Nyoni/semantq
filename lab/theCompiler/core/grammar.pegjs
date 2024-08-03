{
  function joinContent(parts) {
    return parts.join('');
  }
}

definition
  = component*

component
  = scriptBlock
  / styleBlock
  / contentBlock

scriptBlock
  = "script:" _ content:contentBlockContent _ "end:" _
    { return { type: "script", content: content }; }

styleBlock
  = "style:" _ content:contentBlockContent _ "end:" _
    { return { type: "style", content: content }; }

contentBlock
  = "content:" _ content:contentBlockContent _ "end:" _
    { return { type: "content", content: content }; }

contentBlockContent
  = "(" _ content:content _ ")" { return content; }

content
  = (!"end:" .)* { return joinContent($()); }

_  = [ \t\r\n]*
__ = [ \t\r\n]+

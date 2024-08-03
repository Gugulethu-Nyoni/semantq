{
  function trimWhitespace(str) {
    return str.trim();
  }
}

start
  = line*

line
  = scriptLine
  / jsCodeLine
  / blankLine

scriptLine
  = "script:" _ jsCode:jsCode _ eol
    { return { type: "script", content: jsCode || "" }; }

jsCodeLine
  = jsCode:.* eol
    { return { type: "code", content: trimWhitespace(jsCode) }; }

blankLine
  = _ eol

_  = [ \t\r\n]*
eol = "\n" / "\r\n" / "\r"

jsCode
  = [^\n\r]* { return text(); }

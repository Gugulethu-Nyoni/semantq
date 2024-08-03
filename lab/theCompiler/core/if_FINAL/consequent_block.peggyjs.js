{

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

  
  
  
}



Consequent
  = HTML

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
  = OpenCloseTags / SelfClosingTags / TextNode 

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


Identifier
= $([a-zA-Z_$][a-zA-Z_0-9]*)

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
  = raw:$([^<]+) {
    return createText(location().start.offset, location().end.offset, raw);
  }


Identifier
  = name:$([a-zA-Z0-9_])+ {
      return createIdentifier(name);
    }


_
  = [ \r\t\n]*;

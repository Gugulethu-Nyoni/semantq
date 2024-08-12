Script ::= "script:" {Statement}
Statement ::= Identifier "=" Expression ";"
Identifier ::= [a-zA-Z_][a-zA-Z_0-9]*
Expression ::= Term {(ADD | SUB) Term}
Term ::= Factor {(MUL | DIV) Factor}
Factor ::= Identifier | Number | "(" Expression ")"
ADD ::= "+"
SUB ::= "-"
MUL ::= "*"
DIV ::= "/"
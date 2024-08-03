import { Parser } from 'acorn';

export default function acornPluginReactive(Parser) {
  return class extends Parser {
    parseStatement() {
      if (this.eat('$:')) {
        return this.parseReactiveExpressionStatement();
      }
      return super.parseStatement();
    }

    parseReactiveExpressionStatement() {
      const node = this.startNode();
      this.next(); // Consume the '$:'
      node.type = 'ReactiveExpressionStatement'; // Set node type to 'ReactiveExpressionStatement'
      node.expression = this.parseExpression(); // Parse the expression
      this.eat(';'); // Optional semicolon
      return this.finishNode(node, 'ReactiveExpressionStatement');
    }
  };
}
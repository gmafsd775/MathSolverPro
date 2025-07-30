export class MathEngine {
  private constants: { [key: string]: number } = {
    pi: Math.PI,
    e: Math.E,
    phi: (1 + Math.sqrt(5)) / 2, // Golden ratio
  };

  private functions: { [key: string]: (x: number) => number } = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    ln: Math.log,
    log: Math.log10,
    log2: Math.log2,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt,
    abs: Math.abs,
    ceil: Math.ceil,
    floor: Math.floor,
    round: Math.round,
    exp: Math.exp,
  };

  evaluate(expression: string): number {
    // Clean and prepare the expression
    let cleanExpression = this.preprocessExpression(expression);
    
    // Validate the expression
    this.validateExpression(cleanExpression);
    
    // Parse and evaluate
    const tokens = this.tokenize(cleanExpression);
    const postfix = this.infixToPostfix(tokens);
    return this.evaluatePostfix(postfix);
  }

  private preprocessExpression(expr: string): string {
    // Remove whitespace
    expr = expr.replace(/\s+/g, '');
    
    // Replace constants
    Object.keys(this.constants).forEach(constant => {
      const regex = new RegExp(`\\b${constant}\\b`, 'g');
      expr = expr.replace(regex, this.constants[constant].toString());
    });
    
    // Handle implicit multiplication
    expr = expr.replace(/(\d)(\()/g, '$1*$2'); // 2(3) -> 2*(3)
    expr = expr.replace(/(\))(\d)/g, '$1*$2'); // (3)2 -> (3)*2
    expr = expr.replace(/(\))(\()/g, '$1*$2'); // (3)(2) -> (3)*(2)
    
    // Handle negative numbers
    expr = expr.replace(/^-/, '0-'); // -5 -> 0-5
    expr = expr.replace(/\(-/g, '(0-'); // (-5) -> (0-5)
    expr = expr.replace(/([+\-*/^])(-)/g, '$10$2'); // +-5 -> +0-5
    
    return expr;
  }

  private validateExpression(expr: string): void {
    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (const char of expr) {
      if (char === '(') parenthesesCount++;
      if (char === ')') parenthesesCount--;
      if (parenthesesCount < 0) {
        throw new Error('Mismatched parentheses');
      }
    }
    if (parenthesesCount !== 0) {
      throw new Error('Mismatched parentheses');
    }

    // Check for invalid characters
    const validChars = /^[0-9+\-*/^().a-z]+$/i;
    if (!validChars.test(expr)) {
      throw new Error('Invalid characters in expression');
    }

    // Check for consecutive operators
    if (/[+\-*/^]{2,}/.test(expr.replace(/0-/g, ''))) {
      throw new Error('Invalid operator sequence');
    }
  }

  private tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let i = 0;

    while (i < expr.length) {
      const char = expr[i];

      if (/\d/.test(char)) {
        // Parse number (including decimals)
        let num = '';
        while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) {
          num += expr[i];
          i++;
        }
        tokens.push(num);
      } else if (/[a-z]/i.test(char)) {
        // Parse function name
        let func = '';
        while (i < expr.length && /[a-z]/i.test(expr[i])) {
          func += expr[i];
          i++;
        }
        if (this.functions[func]) {
          tokens.push(func);
        } else {
          throw new Error(`Unknown function: ${func}`);
        }
      } else if (['+', '-', '*', '/', '^', '(', ')'].includes(char)) {
        tokens.push(char);
        i++;
      } else {
        throw new Error(`Invalid character: ${char}`);
      }
    }

    return tokens;
  }

  private infixToPostfix(tokens: string[]): string[] {
    const output: string[] = [];
    const operators: string[] = [];
    
    const precedence: { [key: string]: number } = {
      '+': 1, '-': 1,
      '*': 2, '/': 2,
      '^': 3,
    };

    const isRightAssociative = (op: string): boolean => op === '^';

    for (const token of tokens) {
      if (/^\d+\.?\d*$/.test(token)) {
        // Number
        output.push(token);
      } else if (this.functions[token]) {
        // Function
        operators.push(token);
      } else if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (operators.length > 0 && operators[operators.length - 1] !== '(') {
          output.push(operators.pop()!);
        }
        if (operators.length === 0) {
          throw new Error('Mismatched parentheses');
        }
        operators.pop(); // Remove '('
        
        // If there's a function on top of the stack, pop it
        if (operators.length > 0 && this.functions[operators[operators.length - 1]]) {
          output.push(operators.pop()!);
        }
      } else if (precedence[token]) {
        // Operator
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== '(' &&
          (
            this.functions[operators[operators.length - 1]] ||
            precedence[operators[operators.length - 1]] > precedence[token] ||
            (precedence[operators[operators.length - 1]] === precedence[token] && !isRightAssociative(token))
          )
        ) {
          output.push(operators.pop()!);
        }
        operators.push(token);
      }
    }

    while (operators.length > 0) {
      const op = operators.pop()!;
      if (op === '(' || op === ')') {
        throw new Error('Mismatched parentheses');
      }
      output.push(op);
    }

    return output;
  }

  private evaluatePostfix(tokens: string[]): number {
    const stack: number[] = [];

    for (const token of tokens) {
      if (/^\d+\.?\d*$/.test(token)) {
        // Number
        stack.push(parseFloat(token));
      } else if (this.functions[token]) {
        // Function
        if (stack.length < 1) {
          throw new Error(`Insufficient operands for function ${token}`);
        }
        const operand = stack.pop()!;
        const result = this.functions[token](operand);
        
        if (!isFinite(result)) {
          throw new Error(`Mathematical error in function ${token}`);
        }
        
        stack.push(result);
      } else if (['+', '-', '*', '/', '^'].includes(token)) {
        // Binary operator
        if (stack.length < 2) {
          throw new Error(`Insufficient operands for operator ${token}`);
        }
        
        const b = stack.pop()!;
        const a = stack.pop()!;
        let result: number;

        switch (token) {
          case '+':
            result = a + b;
            break;
          case '-':
            result = a - b;
            break;
          case '*':
            result = a * b;
            break;
          case '/':
            if (b === 0) {
              throw new Error('Division by zero');
            }
            result = a / b;
            break;
          case '^':
            result = Math.pow(a, b);
            break;
          default:
            throw new Error(`Unknown operator: ${token}`);
        }

        if (!isFinite(result)) {
          throw new Error('Mathematical error: result is not finite');
        }

        stack.push(result);
      }
    }

    if (stack.length !== 1) {
      throw new Error('Invalid expression');
    }

    return stack[0];
  }
}
export class EquationSolver {
  solveLinear(equation: string): { solution: number; steps: string[] } {
    // Parse linear equation of form ax + b = c
    const steps: string[] = [];
    
    try {
      // Clean the equation
      const cleanEq = equation.replace(/\s+/g, '');
      const [left, right] = cleanEq.split('=');
      
      if (!left || !right) {
        throw new Error('Invalid equation format. Use format: ax + b = c');
      }

      steps.push(`Original equation: ${equation}`);
      
      // Simple linear equation solver (ax + b = c)
      // This is a simplified implementation
      const leftTerms = this.parseLinearExpression(left);
      const rightValue = parseFloat(right);
      
      if (isNaN(rightValue)) {
        throw new Error('Right side must be a number');
      }

      const a = leftTerms.coefficient;
      const b = leftTerms.constant;
      
      steps.push(`Simplified form: ${a}x + ${b} = ${rightValue}`);
      steps.push(`Subtract ${b} from both sides: ${a}x = ${rightValue - b}`);
      
      if (a === 0) {
        if (b === rightValue) {
          steps.push('Infinite solutions (identity)');
          return { solution: Infinity, steps };
        } else {
          steps.push('No solution (contradiction)');
          return { solution: NaN, steps };
        }
      }
      
      const solution = (rightValue - b) / a;
      steps.push(`Divide both sides by ${a}: x = ${solution}`);
      
      return { solution, steps };
    } catch (error) {
      throw new Error(`Error solving equation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  solveQuadratic(a: number, b: number, c: number): { solutions: number[]; steps: string[] } {
    const steps: string[] = [];
    steps.push(`Quadratic equation: ${a}x² + ${b}x + ${c} = 0`);
    
    const discriminant = b * b - 4 * a * c;
    steps.push(`Discriminant: Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`);
    
    if (discriminant < 0) {
      steps.push('Discriminant < 0: No real solutions');
      return { solutions: [], steps };
    } else if (discriminant === 0) {
      const solution = -b / (2 * a);
      steps.push(`Discriminant = 0: One solution`);
      steps.push(`x = -b/(2a) = ${-b}/(2×${a}) = ${solution}`);
      return { solutions: [solution], steps };
    } else {
      const sqrtDiscriminant = Math.sqrt(discriminant);
      const solution1 = (-b + sqrtDiscriminant) / (2 * a);
      const solution2 = (-b - sqrtDiscriminant) / (2 * a);
      
      steps.push(`Discriminant > 0: Two solutions`);
      steps.push(`x₁ = (-b + √Δ)/(2a) = (${-b} + √${discriminant})/(2×${a}) = ${solution1}`);
      steps.push(`x₂ = (-b - √Δ)/(2a) = (${-b} - √${discriminant})/(2×${a}) = ${solution2}`);
      
      return { solutions: [solution1, solution2], steps };
    }
  }

  private parseLinearExpression(expr: string): { coefficient: number; constant: number } {
    // Simple parser for expressions like "2x + 3" or "x - 5"
    let coefficient = 0;
    let constant = 0;
    
    // Remove spaces and handle signs
    expr = expr.replace(/\s+/g, '');
    
    // Split by + and - while keeping the operators
    const terms = expr.split(/([+-])/).filter(term => term !== '');
    
    let currentSign = 1;
    
    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      
      if (term === '+') {
        currentSign = 1;
      } else if (term === '-') {
        currentSign = -1;
      } else {
        if (term.includes('x')) {
          // Extract coefficient
          const coefStr = term.replace('x', '');
          if (coefStr === '' || coefStr === '+') {
            coefficient += currentSign * 1;
          } else if (coefStr === '-') {
            coefficient += currentSign * -1;
          } else {
            coefficient += currentSign * parseFloat(coefStr);
          }
        } else {
          // Constant term
          constant += currentSign * parseFloat(term);
        }
      }
    }
    
    return { coefficient, constant };
  }

  factorQuadratic(a: number, b: number, c: number): string {
    // Simple factoring for integer solutions
    const { solutions } = this.solveQuadratic(a, b, c);
    
    if (solutions.length === 0) {
      return 'Cannot factor (no real solutions)';
    } else if (solutions.length === 1) {
      const r = solutions[0];
      return `${a}(x - ${r})²`;
    } else {
      const [r1, r2] = solutions;
      if (a === 1) {
        return `(x - ${r1})(x - ${r2})`;
      } else {
        return `${a}(x - ${r1})(x - ${r2})`;
      }
    }
  }
}
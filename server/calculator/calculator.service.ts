import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CalculationHistoryItem,
  ConstantItem,
  EvaluateDto,
  MemoryActionDto,
  StepItem,
} from './dto/calculator.dto.ts';

@Injectable()
export class CalculatorService {
  private history: CalculationHistoryItem[] = [];
  private memoryValue: number = 0;

  private readonly constants: ConstantItem[] = [
    {
      symbol: 'π',
      name: 'Pi',
      value: Math.PI,
      category: 'Math',
      description: 'Ratio of a circle circumference to diameter (~3.14159)',
    },
    {
      symbol: 'e',
      name: "Euler's Number",
      value: Math.E,
      category: 'Math',
      description: 'Base of the natural logarithm (~2.71828)',
    },
    {
      symbol: 'φ',
      name: 'Golden Ratio',
      value: 1.618033988749895,
      category: 'Math',
      description: 'Divine proportion (1 + √5)/2 (~1.61803)',
    },
    {
      symbol: 'c',
      name: 'Speed of Light',
      value: 299792458,
      category: 'Physics',
      unit: 'm/s',
      description: 'Exact speed of electromagnetic waves in vacuum',
    },
    {
      symbol: 'h',
      name: "Planck's Constant",
      value: 6.62607015e-34,
      category: 'Physics',
      unit: 'J·s',
      description: 'Fundamental constant in quantum mechanics',
    },
    {
      symbol: 'G',
      name: 'Gravitational Constant',
      value: 6.6743e-11,
      category: 'Physics',
      unit: 'm³/(kg·s²)',
      description: 'Newtonian constant of gravitation',
    },
  ];

  // Evaluate arithmetic and scientific expressions
  evaluate(dto: EvaluateDto): {
    result: number;
    expression: string;
    formattedResult: string;
    angleUnit: 'deg' | 'rad';
    steps: StepItem[];
  } {
    const rawExpr = dto.expression?.trim();
    if (!rawExpr) {
      throw new BadRequestException('Expression cannot be empty');
    }

    const angleUnit = dto.angleUnit || 'deg';
    const precision = dto.precision ?? 10;
    const steps: StepItem[] = [];

    steps.push({
      stepNumber: 1,
      description: 'Normalized input expression',
      expression: rawExpr,
    });

    try {
      // 1. Preprocess expression (normalize symbols, handle constants, implicit multiplication)
      const normalized = this.preprocessExpression(rawExpr, angleUnit, steps);

      // 2. Parse and evaluate
      const resultValue = this.parseAndEvaluate(normalized, angleUnit, steps);

      if (typeof resultValue !== 'number' || isNaN(resultValue)) {
        throw new Error('Calculation resulted in NaN (Not a Number)');
      }

      if (!isFinite(resultValue)) {
        throw new Error('Calculation resulted in Infinity (division by zero or overflow)');
      }

      // Round small precision float artifacts (e.g. 0.1 + 0.2 = 0.30000000000000004)
      const rounded = Number(Math.round(Number(resultValue + `e+${precision}`)) + `e-${precision}`);
      const cleanResult = Object.is(rounded, -0) ? 0 : rounded;

      const formattedResult = this.formatResult(cleanResult);

      steps.push({
        stepNumber: steps.length + 1,
        description: 'Final evaluated result formatted',
        expression: rawExpr,
        result: formattedResult,
      });

      // Save to history
      const historyItem: CalculationHistoryItem = {
        id: 'calc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        expression: rawExpr,
        result: cleanResult,
        angleUnit,
        timestamp: Date.now(),
      };
      this.history.unshift(historyItem);
      if (this.history.length > 50) {
        this.history.pop();
      }

      return {
        result: cleanResult,
        expression: rawExpr,
        formattedResult,
        angleUnit,
        steps,
      };
    } catch (err: any) {
      throw new BadRequestException(err?.message || 'Invalid mathematical expression');
    }
  }

  // Preprocess input
  private preprocessExpression(expr: string, angleUnit: 'deg' | 'rad', steps: StepItem[]): string {
    let s = expr;
    // Replace visual symbols
    s = s.replace(/×/g, '*');
    s = s.replace(/÷/g, '/');
    s = s.replace(/−/g, '-');
    s = s.replace(/π/g, `(${Math.PI})`);
    s = s.replace(/φ/g, '(1.618033988749895)');

    // Replace solo 'e' when not part of scientific notation like 1e-5
    s = s.replace(/(?<![0-9a-zA-Z_])e(?![0-9a-zA-Z_])/g, `(${Math.E})`);

    // Implicit multiplication: e.g., 2(3) -> 2*(3), (2)(3) -> (2)*(3), 2pi -> 2*(pi)
    s = s.replace(/(\d)\s*\(/g, '$1*(');
    s = s.replace(/\)\s*(\d)/g, ')*$1');
    s = s.replace(/\)\s*\(/g, ')*(');

    // Percentage handling: e.g. 50% -> (50/100)
    s = s.replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');

    if (s !== expr) {
      steps.push({
        stepNumber: steps.length + 1,
        description: 'Normalized operators and constants',
        expression: s,
      });
    }

    return s;
  }

  // Mathematical parser using safe recursive descent / token evaluation
  private parseAndEvaluate(expr: string, angleUnit: 'deg' | 'rad', steps: StepItem[]): number {
    const tokens = this.tokenize(expr);
    let index = 0;

    const peek = () => tokens[index];
    const consume = () => tokens[index++];

    // Grammars:
    // Expression = BitwiseOr
    // BitwiseOr = BitwiseXor ( ('|') BitwiseXor )*
    // BitwiseXor = BitwiseAnd ( ('^' bitwise or power) BitwiseAnd )*
    // Additive = Multiplicative ( ('+' | '-') Multiplicative )*
    // Multiplicative = Power ( ('*' | '/' | '%') Power )*
    // Power = Factorial ( ('^' | '**') Power )?
    // Factorial = Unary ( '!' )*
    // Unary = ('+' | '-' | '~') Unary | Primary
    // Primary = Number | FunctionCall | '(' Expression ')'

    const parseExpression = (): number => parseAdditive();

    const parseAdditive = (): number => {
      let left = parseMultiplicative();
      while (index < tokens.length && (peek() === '+' || peek() === '-')) {
        const op = consume();
        const right = parseMultiplicative();
        const before = `${left} ${op} ${right}`;
        if (op === '+') {
          left = left + right;
        } else {
          left = left - right;
        }
        steps.push({
          stepNumber: steps.length + 1,
          description: `Evaluated ${op === '+' ? 'addition' : 'subtraction'}: ${before}`,
          expression: `${left}`,
        });
      }
      return left;
    };

    const parseMultiplicative = (): number => {
      let left = parsePower();
      while (index < tokens.length && (peek() === '*' || peek() === '/' || peek() === '%' || peek().toLowerCase() === 'mod')) {
        const op = consume();
        const right = parsePower();
        const before = `${left} ${op} ${right}`;
        if (op === '*') {
          left = left * right;
        } else if (op === '/') {
          if (right === 0) throw new Error('Division by zero');
          left = left / right;
        } else {
          if (right === 0) throw new Error('Modulo by zero');
          left = left % right;
        }
        steps.push({
          stepNumber: steps.length + 1,
          description: `Evaluated ${op}: ${before}`,
          expression: `${left}`,
        });
      }
      return left;
    };

    const parsePower = (): number => {
      let base = parseFactorial();
      if (index < tokens.length && (peek() === '^' || peek() === '**')) {
        consume();
        const exponent = parsePower(); // right-associative
        const before = `${base} ^ ${exponent}`;
        base = Math.pow(base, exponent);
        steps.push({
          stepNumber: steps.length + 1,
          description: `Evaluated exponent: ${before}`,
          expression: `${base}`,
        });
      }
      return base;
    };

    const parseFactorial = (): number => {
      let val = parseUnary();
      while (index < tokens.length && peek() === '!') {
        consume();
        if (val < 0 || !Number.isInteger(val)) {
          throw new Error(`Factorial is only defined for non-negative integers: ${val}!`);
        }
        if (val > 170) {
          throw new Error(`Factorial overflow for ${val}!`);
        }
        const before = `${val}!`;
        let fact = 1;
        for (let i = 2; i <= val; i++) fact *= i;
        val = fact;
        steps.push({
          stepNumber: steps.length + 1,
          description: `Evaluated factorial: ${before}`,
          expression: `${val}`,
        });
      }
      return val;
    };

    const parseUnary = (): number => {
      if (index < tokens.length && peek() === '+') {
        consume();
        return parseUnary();
      }
      if (index < tokens.length && peek() === '-') {
        consume();
        const val = parseUnary();
        return -val;
      }
      if (index < tokens.length && peek() === '~') {
        consume();
        const val = parseUnary();
        return ~val;
      }
      return parsePrimary();
    };

    const parsePrimary = (): number => {
      if (index >= tokens.length) {
        throw new Error('Unexpected end of expression');
      }

      const token = consume();

      // Parenthesis
      if (token === '(') {
        const val = parseExpression();
        if (consume() !== ')') {
          throw new Error('Mismatched parenthesis: missing closing ")"');
        }
        return val;
      }

      // Numbers
      if (/^-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(token)) {
        return Number(token);
      }

      // Functions
      const lower = token.toLowerCase();
      if (
        [
          'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
          'sqrt', 'cbrt', 'log', 'ln', 'abs', 'exp',
          'round', 'floor', 'ceil', 'fact'
        ].includes(lower)
      ) {
        if (consume() !== '(') {
          throw new Error(`Expected "(" after function "${token}"`);
        }
        const arg = parseExpression();
        if (consume() !== ')') {
          throw new Error(`Expected ")" after arguments in function "${token}"`);
        }

        let evaluated: number;
        switch (lower) {
          case 'sin': {
            const rad = angleUnit === 'deg' ? (arg * Math.PI) / 180 : arg;
            evaluated = Math.sin(rad);
            break;
          }
          case 'cos': {
            const rad = angleUnit === 'deg' ? (arg * Math.PI) / 180 : arg;
            evaluated = Math.cos(rad);
            break;
          }
          case 'tan': {
            const rad = angleUnit === 'deg' ? (arg * Math.PI) / 180 : arg;
            // Check for asymptote (e.g., 90 deg)
            if (angleUnit === 'deg' && Math.abs(arg % 180) === 90) {
              throw new Error(`tan(${arg}°) is undefined (asymptote)`);
            }
            evaluated = Math.tan(rad);
            break;
          }
          case 'asin': {
            if (arg < -1 || arg > 1) throw new Error('asin argument must be in range [-1, 1]');
            const resRad = Math.asin(arg);
            evaluated = angleUnit === 'deg' ? (resRad * 180) / Math.PI : resRad;
            break;
          }
          case 'acos': {
            if (arg < -1 || arg > 1) throw new Error('acos argument must be in range [-1, 1]');
            const resRad = Math.acos(arg);
            evaluated = angleUnit === 'deg' ? (resRad * 180) / Math.PI : resRad;
            break;
          }
          case 'atan': {
            const resRad = Math.atan(arg);
            evaluated = angleUnit === 'deg' ? (resRad * 180) / Math.PI : resRad;
            break;
          }
          case 'sqrt': {
            if (arg < 0) throw new Error('Cannot calculate square root of a negative number');
            evaluated = Math.sqrt(arg);
            break;
          }
          case 'cbrt': {
            evaluated = Math.cbrt(arg);
            break;
          }
          case 'log': {
            if (arg <= 0) throw new Error('log10 requires argument > 0');
            evaluated = Math.log10(arg);
            break;
          }
          case 'ln': {
            if (arg <= 0) throw new Error('Natural log ln requires argument > 0');
            evaluated = Math.log(arg);
            break;
          }
          case 'abs': {
            evaluated = Math.abs(arg);
            break;
          }
          case 'exp': {
            evaluated = Math.exp(arg);
            break;
          }
          case 'round': {
            evaluated = Math.round(arg);
            break;
          }
          case 'floor': {
            evaluated = Math.floor(arg);
            break;
          }
          case 'ceil': {
            evaluated = Math.ceil(arg);
            break;
          }
          case 'fact': {
            if (arg < 0 || !Number.isInteger(arg)) throw new Error('fact requires non-negative integer');
            let f = 1;
            for (let i = 2; i <= arg; i++) f *= i;
            evaluated = f;
            break;
          }
          default:
            throw new Error(`Unknown function: ${token}`);
        }

        steps.push({
          stepNumber: steps.length + 1,
          description: `Evaluated function ${token}(${arg}) [${angleUnit}]`,
          expression: `${evaluated}`,
        });

        return evaluated;
      }

      throw new Error(`Unexpected token "${token}"`);
    };

    const finalResult = parseExpression();
    if (index < tokens.length) {
      throw new Error(`Unexpected extra tokens starting at "${tokens[index]}"`);
    }

    return finalResult;
  }

  // Tokenizer
  private tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    while (i < expr.length) {
      const ch = expr[i];

      // Skip whitespace
      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      // Operators and punctuation
      if (['(', ')', '+', '-', '*', '/', '%', '^', '!', '~'].includes(ch)) {
        // Double star for power: **
        if (ch === '*' && expr[i + 1] === '*') {
          tokens.push('^');
          i += 2;
          continue;
        }
        tokens.push(ch);
        i++;
        continue;
      }

      // Number literal
      if (/\d/.test(ch) || (ch === '.' && /\d/.test(expr[i + 1] || ''))) {
        let numStr = '';
        while (i < expr.length && /[\d.]/.test(expr[i])) {
          numStr += expr[i];
          i++;
        }
        // Check for scientific notation exponent like 1.5e+3 or 2e-4
        if (i < expr.length && (expr[i] === 'e' || expr[i] === 'E') && /[\d+-]/.test(expr[i + 1] || '')) {
          numStr += expr[i];
          i++;
          if (expr[i] === '+' || expr[i] === '-') {
            numStr += expr[i];
            i++;
          }
          while (i < expr.length && /\d/.test(expr[i])) {
            numStr += expr[i];
            i++;
          }
        }
        tokens.push(numStr);
        continue;
      }

      // Words (functions, constants)
      if (/[a-zA-Z_]/.test(ch)) {
        let word = '';
        while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
          word += expr[i];
          i++;
        }
        tokens.push(word);
        continue;
      }

      throw new Error(`Unrecognized character in expression: "${ch}"`);
    }

    return tokens;
  }

  // Format result nicely
  private formatResult(num: number): string {
    if (Math.abs(num) > 1e14 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6).replace(/\.?0+e/, 'e');
    }
    return String(num);
  }

  // Base conversions (Programmer Mode)
  convertBase(valueStr: string | number, fromBase: 2 | 8 | 10 | 16) {
    const raw = String(valueStr).trim();
    if (!raw) throw new BadRequestException('Value is required for conversion');

    const intVal = parseInt(raw, fromBase);
    if (isNaN(intVal)) {
      throw new BadRequestException(`Invalid base-${fromBase} number: ${raw}`);
    }

    const signed32 = intVal | 0;
    const unsigned32 = (intVal >>> 0);

    return {
      dec: signed32.toString(10),
      hex: unsigned32.toString(16).toUpperCase(),
      oct: unsigned32.toString(8),
      bin: unsigned32.toString(2).padStart(8, '0'),
      bits: 32,
      signed32,
      unsigned32,
    };
  }

  // Memory operations
  handleMemory(dto: MemoryActionDto): { memory: number; message: string } {
    const val = Number(dto.value || 0);

    switch (dto.action) {
      case 'store':
        this.memoryValue = val;
        return { memory: this.memoryValue, message: `Stored ${val} in memory` };
      case 'add':
        this.memoryValue += val;
        return { memory: this.memoryValue, message: `Added ${val} to memory (Total: ${this.memoryValue})` };
      case 'subtract':
        this.memoryValue -= val;
        return { memory: this.memoryValue, message: `Subtracted ${val} from memory (Total: ${this.memoryValue})` };
      case 'clear':
        this.memoryValue = 0;
        return { memory: 0, message: 'Memory cleared' };
      case 'recall':
        return { memory: this.memoryValue, message: `Recalled memory: ${this.memoryValue}` };
      default:
        throw new BadRequestException('Invalid memory action');
    }
  }

  getMemory(): { memory: number } {
    return { memory: this.memoryValue };
  }

  // History operations
  getHistory(): CalculationHistoryItem[] {
    return this.history;
  }

  clearHistory(): { cleared: boolean; count: number } {
    const count = this.history.length;
    this.history = [];
    return { cleared: true, count };
  }

  deleteHistoryItem(id: string): { success: boolean } {
    const prev = this.history.length;
    this.history = this.history.filter((item) => item.id !== id);
    return { success: this.history.length < prev };
  }

  // Constants
  getConstants(): ConstantItem[] {
    return this.constants;
  }
}

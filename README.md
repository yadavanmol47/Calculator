# NestJS Calculator

A full-stack, enterprise-grade calculator application powered by an embedded **NestJS v12** backend and a responsive **React 19** frontend built with **Vite**, **Tailwind CSS**, and **Motion**.

The application features a custom mathematical parsing engine with tokenization and recursive descent evaluation, step-by-step solution breakdowns, three distinct calculator modes (Standard, Scientific, and Programmer), calculation history persistence, memory registers, and scientific constants reference.

---

## 🌟 Key Features

### 1. Three Specialized Calculation Modes
- **Standard Mode**: Everyday arithmetic operations with support for order of operations (PEMDAS), nested parentheses, percentages, exponentiation, and memory registers.
- **Scientific Mode**: Comprehensive scientific operations including trigonometric functions (`sin`, `cos`, `tan`, `asin`, `acos`, `atan`), degree/radian toggle, logarithms (`log`, `ln`), square and cube roots (`sqrt`, `cbrt`), factorials (`fact`, `!`), and Euler/Pi constants.
- **Programmer Mode**: Multi-base integer conversions with simultaneous synchronized displays for **DEC** (Decimal), **HEX** (Hexadecimal), **OCT** (Octal), and **BIN** (Binary), along with 32-bit signed and unsigned representations.

### 2. NestJS Evaluation Engine
- **AST / Recursive Descent Parser**: Mathematical expressions are tokenized and parsed server-side using precedence-aware recursive descent rather than unsafe string evaluation (`eval`).
- **Step-by-Step Breakdown**: Generates a step-by-step trace showing operator normalization, intermediate sub-expression evaluations, and final formatting.
- **Floating-Point Precision Normalization**: Eliminates standard IEEE 754 floating-point artifacts (e.g., `0.1 + 0.2 = 0.3`).

### 3. Calculation History & Memory Registers
- **History Drawer**: Keeps a chronological record of calculations with timestamps. Click any previous expression or result to recall it into the active display, or delete individual records.
- **Memory Operations**: Full support for memory actions: Memory Store (`MS`), Memory Add (`M+`), Memory Subtract (`M-`), Memory Recall (`MR`), and Memory Clear (`MC`).

### 4. Constants Reference Library
- Direct access to fundamental mathematical and physical constants with symbols, descriptions, and units:
  - $\pi$ (Pi): `3.1415926535...`
  - $e$ (Euler's Number): `2.7182818284...`
  - $\phi$ (Golden Ratio): `1.6180339887...`
  - $c$ (Speed of Light): `299,792,458 m/s`
  - $h$ (Planck's Constant): `6.62607015 × 10⁻³⁴ J·s`
  - $G$ (Gravitational Constant): `6.6743 × 10⁻¹¹ m³/(kg·s²)`

### 5. Seamless Full-Stack Integration
- **Real-Time Backend Status**: Live health check badge polling `/api/calculator/health`, displaying NestJS engine status, server uptime, and round-trip HTTP latency in milliseconds.
- **Full Keyboard Navigation**: Type digits, operators, parentheses, or press `Enter` to evaluate, `Backspace` to delete, and `Escape` to clear.

---

## 🏗️ Architecture & Project Structure

The project integrates the NestJS application directly into the Express server that hosts the Vite development middleware in development and serves static assets in production.

```
├── server.ts                               # App entry point (Express + NestJS + Vite middleware)
├── server/
│   ├── app.module.ts                       # Root NestJS module
│   └── calculator/
│       ├── calculator.module.ts            # Calculator NestJS module
│       ├── calculator.controller.ts        # REST API controller (/api/calculator/*)
│       ├── calculator.service.ts           # Tokenizer, parser, base converter & history store
│       └── dto/
│           └── calculator.dto.ts           # DTOs and payload interfaces
├── src/
│   ├── main.tsx                            # React client entry point
│   ├── App.tsx                             # Main UI shell, mode switching, keyboard listeners
│   ├── index.css                           # Tailwind CSS styling
│   ├── types.ts                            # Frontend shared TypeScript interfaces
│   ├── api/
│       └── calculatorApi.ts                # Client API wrapper for NestJS endpoints
│   └── components/
│       ├── CalculatorDisplay.tsx           # Digital screen with latency, formula & result
│       ├── KeypadStandard.tsx              # Standard mode keypad
│       ├── KeypadScientific.tsx            # Scientific mode keypad
│       ├── KeypadProgrammer.tsx            # Programmer mode keypad & bit breakdown
│       ├── HistoryDrawer.tsx               # Slide-over calculation history panel
│       ├── StepByStepModal.tsx             # Step-by-step explanation modal
│       ├── ConstantsModal.tsx              # Scientific constants picker
│       └── NestJsStatusBadge.tsx           # Live NestJS connectivity & latency pill
├── index.html                              # HTML entry point
├── package.json                            # Scripts and dependencies
├── tsconfig.json                           # TypeScript configuration
└── vite.config.ts                          # Vite and Tailwind build configuration
```

---

## 📡 REST API Reference

All backend endpoints are prefixed with `/api/calculator`.

| Method | Endpoint | Description | Request Body Example |
|---|---|---|---|
| `GET` | `/api/calculator/health` | Service health, framework info, and uptime | _None_ |
| `POST` | `/api/calculator/evaluate` | Evaluates expression with angle unit (`deg`/`rad`) | `{"expression": "sin(30) + 5 * 2", "angleUnit": "deg"}` |
| `POST` | `/api/calculator/step-by-step`| Returns step-by-step reduction steps | `{"expression": "2 * (3 + 4)", "angleUnit": "deg"}` |
| `POST` | `/api/calculator/convert` | Converts values between bases 2, 8, 10, 16 | `{"value": "255", "fromBase": 10}` |
| `GET` | `/api/calculator/history` | Fetches calculation history list | _None_ |
| `DELETE` | `/api/calculator/history/:id` | Deletes a specific history record | _None_ |
| `DELETE` | `/api/calculator/history` | Clears all calculation history | _None_ |
| `GET` | `/api/calculator/memory` | Retrieves current value stored in memory | _None_ |
| `POST` | `/api/calculator/memory` | Executes memory action (`store`, `add`, `subtract`, `clear`, `recall`) | `{"action": "add", "value": 42}` |
| `GET` | `/api/calculator/constants` | Returns scientific constants library | _None_ |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `0` - `9` | Enter digit |
| `.` | Enter decimal point |
| `+` | Add operator (`+`) |
| `-` | Subtract operator (`−`) |
| `*` | Multiply operator (`×`) |
| `/` | Divide operator (`÷`) |
| `%` | Percent operator (`%`) |
| `^` | Power / exponent (`^`) |
| `(` and `)` | Parentheses |
| `Enter` or `=` | Evaluate expression |
| `Backspace` | Delete last token |
| `Escape` | Clear current input / display |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 20 or higher
- **npm** or **bun**

### Installation
Clone the repository and install dependencies:

```bash
npm install
```

### Development Mode
Start the development server with live reload:

```bash
npm run dev
```

The server binds to port `3000` (`http://localhost:3000`), serving both the NestJS API endpoints under `/api/*` and the React frontend via Vite middleware.

### Production Build
Build the Vite frontend and bundle the server using esbuild:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Linting & Type Checking
Verify TypeScript types across frontend and backend:

```bash
npm run lint
```

---

## 🛠️ Technology Stack

- **Backend**: [NestJS 12](https://nestjs.com/), [Express 5](https://expressjs.com/), [RxJS](https://rxjs.dev/), `reflect-metadata`
- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS 4](https://tailwindcss.com/), [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tooling**: [Vite 8](https://vitejs.dev/), [esbuild](https://esbuild.github.io/), [tsx](https://github.com/privatenumber/tsx)

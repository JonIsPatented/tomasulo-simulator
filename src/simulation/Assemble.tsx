import type { Result } from "../util/Result.tsx";
import type {
  ArithmeticInstruction,
  Instruction,
  MemoryInstruction,
} from "./Simulation";

export type AssembleError =
  | { code: "EMPTY_PROGRAM" }
  | { code: "INVALID_INSTRUCTION"; line: number; text: string }
  | {
      code: "INVALID_REGISTER";
      line: number;
      register: number;
      registerFileSize: number;
    };

type ParseRule = [RegExp, (match: RegExpMatchArray) => Instruction];

const parseRules: ParseRule[] = [
  // Floating point addition instruction
  [
    /^fadd\s+f(\d+)\s*,\s*f(\d+)\s*,\s*f(\d+)$/i,
    (match): ArithmeticInstruction => ({
      type: "arithmetic",
      opcode: "add",
      destination: Number(match[1]),
      source1: Number(match[2]),
      source2: Number(match[3]),
    }),
  ],

  // Floating point subtraction instruction
  [
    /^fsub\s+f(\d+)\s*,\s*f(\d+)\s*,\s*f(\d+)$/i,
    (match): ArithmeticInstruction => ({
      type: "arithmetic",
      opcode: "sub",
      destination: Number(match[1]),
      source1: Number(match[2]),
      source2: Number(match[3]),
    }),
  ],

  // Floating point multiplication instruction
  [
    /^fmul\s+f(\d+)\s*,\s*f(\d+)\s*,\s*f(\d+)$/i,
    (match): ArithmeticInstruction => ({
      type: "arithmetic",
      opcode: "mul",
      destination: Number(match[1]),
      source1: Number(match[2]),
      source2: Number(match[3]),
    }),
  ],

  // Floating point division instruction
  [
    /^fdiv\s+f(\d+)\s*,\s*f(\d+)\s*,\s*f(\d+)$/i,
    (match): ArithmeticInstruction => ({
      type: "arithmetic",
      opcode: "div",
      destination: Number(match[1]),
      source1: Number(match[2]),
      source2: Number(match[3]),
    }),
  ],

  // Load instruction
  [
    /^ld\s+f(\d+)\s*,\s*(-?\d+)\s*\(\s*f(\d+)\s*\)$/i,
    (match): MemoryInstruction => ({
      type: "memory",
      opcode: "ld",
      register: Number(match[1]),
      offset: Number(match[2]),
      baseRegister: Number(match[3]),
    }),
  ],

  // Store instruction
  [
    /^st\s+f(\d+)\s*,\s*(-?\d+)\s*\(\s*f(\d+)\s*\)$/i,
    (match): MemoryInstruction => ({
      type: "memory",
      opcode: "st",
      register: Number(match[1]),
      offset: Number(match[2]),
      baseRegister: Number(match[3]),
    }),
  ],
];

export const removeBlockComments = (program: string): string => {
  return program.replace(/\/\*[\s\S]*?\*\//g, "");
};

export const removeLineComment = (line: string): string => {
  return line
    .replace(/\/\/.*$/g, "")
    .replace(/#.*$/g, "")
    .replace(/;.*$/g, "");
};

export const normalizeCommaSpacing = (line: string): string => {
  return line.replace(/\s*,\s*/g, ", ");
};

export const normalizeParentheses = (line: string): string => {
  return line.replace(/\(\s*/g, "(").replace(/\s*\)/g, ")");
};

export const collapseWhitespace = (line: string): string => {
  return line.replace(/\s+/g, " ");
};

export const trimLine = (line: string): string => {
  return line.trim();
};

export const lineTransforms = [
  removeLineComment,
  normalizeCommaSpacing,
  normalizeParentheses,
  collapseWhitespace,
  trimLine,
];

export const scrubLine = (line: string): string => {
  return lineTransforms.reduce((acc, fn) => fn(acc), line);
};

export const scrubProgram = (program: string): string[] => {
  const noBlockComments = removeBlockComments(program);

  return noBlockComments
    .split(/\r?\n/)
    .map(scrubLine)
    .filter((line) => line.length > 0);
};

const parseInstruction = (line: string): Instruction | null => {
  for (const [pattern, buildInstruction] of parseRules) {
    const match = line.match(pattern);

    if (match) {
      return buildInstruction(match);
    }
  }

  return null;
};

const isValidRegister = (
  registerIndex: number,
  registerFileSize: number,
): boolean => {
  return registerIndex >= 0 && registerIndex < registerFileSize;
};

export const assembleProgram = (
  program: string,
  registerFileSize: number,
): Result<Instruction[], AssembleError> => {
  const scrubbedLines = scrubProgram(program);

  if (scrubbedLines.length === 0) {
    return {
      ok: false,
      error: {
        code: "EMPTY_PROGRAM",
      },
    };
  }

  const instructions: Instruction[] = [];

  for (let index = 0; index < scrubbedLines.length; index++) {
    const line = scrubbedLines[index];
    const instruction = parseInstruction(line);

    if (instruction === null) {
      return {
        ok: false,
        error: {
          code: "INVALID_INSTRUCTION",
          line: index + 1,
          text: line,
        },
      };
    }

    const registersToValidate =
      instruction.type === "arithmetic"
        ? [instruction.destination, instruction.source1, instruction.source2]
        : [instruction.register, instruction.baseRegister];

    const invalidRegister = registersToValidate.find(
      (register) => !isValidRegister(register, registerFileSize),
    );

    if (invalidRegister !== undefined) {
      return {
        ok: false,
        error: {
          code: "INVALID_REGISTER",
          line: index + 1,
          register: invalidRegister,
          registerFileSize: registerFileSize,
        },
      };
    }

    instructions.push(instruction);
  }

  return {
    ok: true,
    value: instructions,
  };
};

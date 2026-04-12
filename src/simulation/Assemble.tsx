import type { Instruction } from "./Simulation";

export interface AssembleSuccess {
  passed: true;
  instructions: Instruction[];
}

export interface AssembleError {
  passed: false;
  lineNumber: number;
  lineText: string;
  message: string;
}

export type AssembleResult = AssembleSuccess | AssembleError;

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

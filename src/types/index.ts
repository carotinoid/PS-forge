
export interface ProblemStatement {
  title: string;
  timeLimit: string;
  memoryLimit: string;
  legend: string;
  inputs: string;
  outputs: string;
  example: string;
  notes: string;
}

export interface StatementEvaluation {
  qualityScore: number;
  isSuitable: boolean;
  feedback: string;
}

export interface GeneratedCodes {
  inputGeneratorCode?: string;
  validatorCode?: string;
  solutionCode?: string;
}

export interface FullProblemEvaluation {
  overallAssessment: string;
  errorsFound: boolean;
  suggestions: string;
}

export enum AppStep {
  USER_INPUT = 1,
  REVIEW_STATEMENT,
  REVIEW_FULL_PROBLEM,
}

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

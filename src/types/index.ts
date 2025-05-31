
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

const TIERS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby"] as const;
const LEVELS = ["V", "IV", "III", "II", "I"] as const;

const generateDifficulties = () => {
  const difficulties: string[] = [];
  TIERS.forEach(tier => {
    LEVELS.forEach(level => {
      difficulties.push(`${tier} ${level}`);
    });
  });
  return difficulties;
};

export const DIFFICULTIES = generateDifficulties();
export type Difficulty = (typeof DIFFICULTIES)[number];

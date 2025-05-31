
'use server';

/**
 * @fileOverview This flow evaluates the entire problem-solving package for errors and inconsistencies.
 *
 * - evaluateFullProblem - A function that evaluates the entire problem-solving package.
 * - EvaluateFullProblemInput - The input type for the evaluateFullProblem function.
 * - EvaluateFullProblemOutput - The return type for the evaluateFullProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateFullProblemInputSchema = z.object({
  statement: z.string().describe('The problem statement, including title, time limit, memory limit, legend, inputs, outputs, example, and notes.'),
  inputs: z.string().describe('The generated C++ input generator code.'),
  validator: z.string().describe('The generated C++ validator code.'),
  solution: z.string().describe('The generated C++ solution code.'),
});
export type EvaluateFullProblemInput = z.infer<typeof EvaluateFullProblemInputSchema>;

const EvaluateFullProblemOutputSchema = z.object({
  overallAssessment: z.string().describe('A comprehensive assessment of the entire problem-solving package, highlighting any errors, inconsistencies, or areas for improvement. This should be the main body of your evaluation.'),
  errorsFound: z.boolean().describe('Set to true if any errors, inconsistencies, or significant issues are found in the problem package (statement, inputs, validator, or solution). Set to false if the package appears robust and correct.'),
  suggestions: z.string().describe('Specific, actionable suggestions for improving any part of the problem package (statement, inputs, validator, solution). If no specific suggestions, this can be left blank or provide a brief positive remark.'),
});
export type EvaluateFullProblemOutput = z.infer<typeof EvaluateFullProblemOutputSchema>;

export async function evaluateFullProblem(input: EvaluateFullProblemInput): Promise<EvaluateFullProblemOutput> {
  return evaluateFullProblemFlow(input);
}

const evaluateFullProblemPrompt = ai.definePrompt({
  name: 'evaluateFullProblemPrompt',
  input: {schema: EvaluateFullProblemInputSchema},
  output: {schema: EvaluateFullProblemOutputSchema},
  prompt: `You are an expert problem evaluator for competitive programming. You will receive a problem statement, C++ input generator code, C++ validator code, and C++ solution code.
  Your task is to meticulously evaluate the entire package for correctness, consistency, and overall quality.

  Problem Statement:
  {{{statement}}}

  Input Generator Code:
  {{{inputs}}}

  Validator Code:
  {{{validator}}}

  Solution Code:
  {{{solution}}}

  Your evaluation should:
  1.  Write a comprehensive analysis into the 'overallAssessment' field. This should cover:
      -   Consistency between the problem statement, input generator, validator, and solution.
      -   Correctness of the input generator (does it produce valid inputs according to the statement, including edge cases?).
      -   Correctness of the validator (does it correctly accept all valid inputs and reject all invalid inputs based on the statement? Does it check all constraints?).
      -   Correctness of the solution (does it solve the problem described in the statement for all valid inputs within typical competitive programming limits?).
      -   Potential edge cases or vulnerabilities not handled.
      -   Clarity and quality of the problem statement itself.
  2.  Based on your assessment, set the 'errorsFound' field:
      -   Set to \`true\` if you identify any logical errors, inconsistencies, significant omissions, or clear bugs in any part of the package.
      -   Set to \`false\` if the package appears to be high quality, consistent, and correct.
  3.  Provide specific, actionable suggestions for improvement in the 'suggestions' field. If the package is excellent, you can state that here.

  Be as detailed as possible. The goal is to create a robust and contest-ready problem.
  `,
});

const evaluateFullProblemFlow = ai.defineFlow(
  {
    name: 'evaluateFullProblemFlow',
    inputSchema: EvaluateFullProblemInputSchema,
    outputSchema: EvaluateFullProblemOutputSchema,
  },
  async input => {
    const {output} = await evaluateFullProblemPrompt(input);
    return output!;
  }
);


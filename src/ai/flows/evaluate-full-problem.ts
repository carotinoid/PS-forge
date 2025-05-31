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
  inputs: z.string().describe('The generated inputs for the problem.'),
  validator: z.string().describe('The generated C++ validator code.'),
  solution: z.string().describe('The generated C++ solution code.'),
});
export type EvaluateFullProblemInput = z.infer<typeof EvaluateFullProblemInputSchema>;

const EvaluateFullProblemOutputSchema = z.object({
  overallAssessment: z.string().describe('A comprehensive assessment of the entire problem-solving package, highlighting any errors, inconsistencies, or areas for improvement.'),
  errorsFound: z.boolean().describe('Indicates whether any errors or inconsistencies were found in the problem-solving package.'),
  suggestions: z.string().describe('Suggestions for improving the problem statement, inputs, validator, or solution.'),
});
export type EvaluateFullProblemOutput = z.infer<typeof EvaluateFullProblemOutputSchema>;

export async function evaluateFullProblem(input: EvaluateFullProblemInput): Promise<EvaluateFullProblemOutput> {
  return evaluateFullProblemFlow(input);
}

const evaluateFullProblemPrompt = ai.definePrompt({
  name: 'evaluateFullProblemPrompt',
  input: {schema: EvaluateFullProblemInputSchema},
  output: {schema: EvaluateFullProblemOutputSchema},
  prompt: `You are an expert problem evaluator. You will receive a problem statement, generated inputs, a validator, and a solution.
  Your task is to evaluate the entire problem-solving package for correctness, consistency, and overall quality.

  Statement: {{{statement}}}
  Inputs: {{{inputs}}}
  Validator: {{{validator}}}
  Solution: {{{solution}}}

  Provide a comprehensive assessment, indicate if any errors were found, and offer suggestions for improvement.
  Be as detailed as possible in your evaluation, looking for potential edge cases, vulnerabilities, or areas where the problem could be made more robust.
  The inputs, validator, and solution must all be consistent with the problem statement.
  The validator must validate all correct inputs, and reject incorrect inputs.
  The solution must produce correct outputs according to the problem statement for all valid inputs.
  If any issues are found, set errorsFound to true, otherwise false.  If there are suggestions to make, include them, otherwise leave them blank.
  Remember to set the isHealthy output field appropriately.
  Make sure the entire assessment is written to the overallAssessment output field.  Make sure the suggestions for improvement are written to the suggestions output field.
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

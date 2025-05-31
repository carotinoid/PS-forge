'use server';

/**
 * @fileOverview Problem statement evaluation flow.
 *
 * - evaluateProblemStatement - Evaluates a problem statement for quality and suitability.
 * - EvaluateProblemStatementInput - The input type for the evaluateProblemStatement function.
 * - EvaluateProblemStatementOutput - The return type for the evaluateProblemStatement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateProblemStatementInputSchema = z.object({
  problemStatement: z
    .string()
    .describe('The problem statement to evaluate.'),
});
export type EvaluateProblemStatementInput = z.infer<
  typeof EvaluateProblemStatementInputSchema
>;

const EvaluateProblemStatementOutputSchema = z.object({
  qualityScore: z
    .number()
    .describe(
      'A score (0-1) representing the overall quality of the problem statement. Higher is better.'
    ),
  isSuitable: z
    .boolean()
    .describe(
      'Whether the problem statement is suitable for use in a competitive programming context.'
    ),
  feedback: z
    .string()
    .describe('Detailed feedback on the problem statement, including areas for improvement.'),
});
export type EvaluateProblemStatementOutput = z.infer<
  typeof EvaluateProblemStatementOutputSchema
>;

export async function evaluateProblemStatement(
  input: EvaluateProblemStatementInput
): Promise<EvaluateProblemStatementOutput> {
  return evaluateProblemStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateProblemStatementPrompt',
  input: {schema: EvaluateProblemStatementInputSchema},
  output: {schema: EvaluateProblemStatementOutputSchema},
  prompt: `You are an expert in competitive programming problem design.

You are given a problem statement and must evaluate its quality and suitability for use in a competitive programming contest.

Provide a qualityScore between 0 and 1 (higher is better).  The score should reflect overall quality, clarity, and interest level of the problem.

Indicate in isSuitable (true/false) whether the problem would be appropriate to use in a programming contest.

Provide detailed feedback on the problem statement, including areas for improvement.

Problem Statement:
{{{problemStatement}}}
`,
});

const evaluateProblemStatementFlow = ai.defineFlow(
  {
    name: 'evaluateProblemStatementFlow',
    inputSchema: EvaluateProblemStatementInputSchema,
    outputSchema: EvaluateProblemStatementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

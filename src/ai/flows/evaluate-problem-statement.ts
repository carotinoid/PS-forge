
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
    .min(0)
    .max(1)
    .describe(
      'A score (0-1) representing the overall quality of the problem statement. Higher is better. Scores 0.9-1.0 are for exceptionally well-crafted problems. 0.7-0.89 for good problems with minor improvement areas. Below 0.7 suggests significant issues.'
    ),
  isSuitable: z
    .boolean()
    .describe(
      'Whether the problem statement is suitable for use in a competitive programming context.'
    ),
  feedback: z
    .string()
    .describe('Detailed feedback on the problem statement, including areas for improvement. Be specific and critical.'),
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

You are given a problem statement and must critically evaluate its quality and suitability for use in a competitive programming contest.

Provide a qualityScore between 0 and 1 (higher is better).
- A score of 0.9-1.0 should be reserved for exceptionally well-crafted problems suitable for high-stakes contests: unambiguous, interesting, clear constraints, and effectively tests specific skills.
- A score of 0.7-0.89 indicates a good problem with minor room for improvement.
- Scores below 0.7 suggest significant issues or lack of suitability.

Indicate in isSuitable (true/false) whether the problem would be appropriate to use in a programming contest.

Provide detailed and critical feedback on the problem statement. Highlight strengths and weaknesses.
Specifically comment on:
- Clarity and unambiguity of the problem description.
- Interest level of the problem.
- Appropriateness and clarity of input/output specifications and constraints.
- Whether the example clearly illustrates the problem.
- Any potential edge cases or unaddressed details.
- Overall suitability for a contest setting.

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


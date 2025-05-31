'use server';

/**
 * @fileOverview A problem statement generator AI agent.
 *
 * - generateProblemStatement - A function that handles the problem statement generation process.
 * - GenerateProblemStatementInput - The input type for the generateProblemStatement function.
 * - GenerateProblemStatementOutput - The return type for the generateProblemStatement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProblemStatementInputSchema = z.object({
  difficulty: z
    .string()
    .describe('The difficulty level of the problem (e.g., Easy, Medium, Hard).'),
  algorithmTags: z
    .string()
    .describe('Comma-separated list of relevant algorithms (e.g., Dynamic Programming, Graph Theory).'),
});
export type GenerateProblemStatementInput = z.infer<
  typeof GenerateProblemStatementInputSchema
>;

const GenerateProblemStatementOutputSchema = z.object({
  title: z.string().describe('The title of the problem.'),
  timeLimit: z.string().describe('The time limit for the problem (e.g., 1 second).'),
  memoryLimit: z.string().describe('The memory limit for the problem (e.g., 256 MB).'),
  legend: z.string().describe('The problem legend/description.'),
  inputs: z.string().describe('The format and constraints of the input.'),
  outputs: z.string().describe('The format and requirements of the output.'),
  example: z.string().describe('An example input and its corresponding output.'),
  notes: z.string().describe('Additional notes or constraints for the problem.'),
});

export type GenerateProblemStatementOutput = z.infer<
  typeof GenerateProblemStatementOutputSchema
>;

export async function generateProblemStatement(
  input: GenerateProblemStatementInput
): Promise<GenerateProblemStatementOutput> {
  return generateProblemStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProblemStatementPrompt',
  input: {schema: GenerateProblemStatementInputSchema},
  output: {schema: GenerateProblemStatementOutputSchema},
  prompt: `You are an expert problem setter for competitive programming contests.
  Your task is to generate a problem statement based on the given difficulty and algorithm tags.
  The problem statement should include the following sections:

  - Title: A concise and descriptive title for the problem.
  - Time Limit: The time limit for the solution to run (e.g., 1 second).
  - Memory Limit: The memory limit for the solution to use (e.g., 256 MB).
  - Legend: A clear and engaging description of the problem.
  - Inputs: A detailed explanation of the input format and constraints.
  - Outputs: A precise description of the expected output format.
  - Example: An example input and its corresponding output.
  - Notes: Any additional notes or constraints for the problem.

  Difficulty: {{{difficulty}}}
  Algorithm Tags: {{{algorithmTags}}}

  Please generate a creative, interesting and well-defined problem statement.
  Ensure that the problem is solvable within the given time and memory limits.
  The problem should align with the specified difficulty and algorithm tags.

  Output the problem statement in a structured format, with each section clearly labeled.
`,
});

const generateProblemStatementFlow = ai.defineFlow(
  {
    name: 'generateProblemStatementFlow',
    inputSchema: GenerateProblemStatementInputSchema,
    outputSchema: GenerateProblemStatementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

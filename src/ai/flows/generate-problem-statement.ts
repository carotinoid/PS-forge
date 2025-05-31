
'use server';
/**
 * @fileOverview A problem statement generator AI agent.
 *
 * - generateProblemStatement - A function that handles the problem statement generation process.
 * - GenerateProblemStatementInput - The input type for the generateProblemStatement function.
 * - GenerateProblemStatementOutput - The return type for the generateProblemStatement function.
 */

import {ai} from '@/ai/genkit';
import type {GenerateOptions} from 'genkit';
import {z}from 'genkit';

const GenerateProblemStatementInputSchema = z.object({
  difficulty: z
    .string()
    .describe('The difficulty level of the problem (e.g., Bronze V, Silver II, Gold I, etc.). This indicates a specific rank within a tier.'),
  algorithmTags: z
    .string()
    .describe('Comma-separated list of relevant algorithms (e.g., Dynamic Programming, Graph Theory).'),
  temperature: z.number().min(0).max(1).optional().describe('Optional. The creativity temperature for the AI model (0.0 to 1.0). Higher values mean more creative/random, lower values mean more deterministic. If not provided, model default is used.'),
  titleIdea: z.string().optional().describe('Optional. A user-suggested idea for the problem title.'),
  problemIdea: z.string().optional().describe('Optional. User-provided keywords or a brief idea for the problem content.'),
});
export type GenerateProblemStatementInput = z.infer<
  typeof GenerateProblemStatementInputSchema
>;

const GenerateProblemStatementOutputSchema = z.object({
  title: z.string().describe('The title of the problem.'),
  timeLimit: z.string().describe('The time limit for the problem (e.g., 1 second).'),
  memoryLimit: z.string().describe('The memory limit for the problem (e.g., 256 MB).'),
  legend: z.string().describe('The problem legend/description, using LaTeX format. Mathematical expressions should be enclosed in $ symbols (e.g., $x^2 + y^2 = z^2$).'),
  inputs: z.string().describe('The format and constraints of the input, using LaTeX format. Mathematical expressions should be enclosed in $ symbols.'),
  outputs: z.string().describe('The format and requirements of the output, using LaTeX format. Mathematical expressions should be enclosed in $ symbols.'),
  example: z.string().describe('An example input and its corresponding output, using LaTeX format. Mathematical expressions should be enclosed in $ symbols.'),
  notes: z.string().describe('Additional notes or constraints for the problem, using LaTeX format. Mathematical expressions should be enclosed in $ symbols.'),
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
  Your task is to generate a problem statement based on the given difficulty, algorithm tags, and optional user ideas.
  The problem statement should include the following sections:

  - Title: A concise and descriptive title for the problem. {{#if titleIdea}}Consider this user suggestion for the title: {{{titleIdea}}}{{/if}}
  - Time Limit: The time limit for the solution to run (e.g., 1 second).
  - Memory Limit: The memory limit for the solution to use (e.g., 256 MB).
  - Legend: A clear and engaging description of the problem. Use LaTeX format. Mathematical expressions should be enclosed in $ symbols (e.g., $x^2 + y^2 = z^2$).
  - Inputs: A detailed explanation of the input format and constraints. Use LaTeX format. Mathematical expressions should be enclosed in $ symbols.
  - Outputs: A precise description of the expected output format. Use LaTeX format. Mathematical expressions should be enclosed in $ symbols.
  - Example: An example input and its corresponding output. Use LaTeX format. Mathematical expressions should be enclosed in $ symbols.
  - Notes: Any additional notes or constraints for the problem. Use LaTeX format. Mathematical expressions should be enclosed in $ symbols.

  Difficulty: {{{difficulty}}} (This is a specific level, e.g., Bronze V is easier than Bronze I, Silver V is easier than Silver I).
  Algorithm Tags: {{{algorithmTags}}}
  {{#if problemIdea}}User-provided idea/keywords to consider: {{{problemIdea}}}{{/if}}

  Please generate a creative, interesting and well-defined problem statement.
  Ensure that the problem is solvable within the given time and memory limits.
  The problem should align with the specified difficulty and algorithm tags.
  If the user provided a title idea or problem idea, try to incorporate it naturally while ensuring the problem quality.

  Output the problem statement in the specified structured format. For the Legend, Inputs, Outputs, Example, and Notes sections, ensure content uses LaTeX syntax where appropriate, especially for mathematical formulas (e.g., $O(N \log N)$).
`,
});

const generateProblemStatementFlow = ai.defineFlow(
  {
    name: 'generateProblemStatementFlow',
    inputSchema: GenerateProblemStatementInputSchema,
    outputSchema: GenerateProblemStatementOutputSchema,
  },
  async input => {
    const generateOptions: GenerateOptions = {};
    if (input.temperature !== undefined) {
      generateOptions.temperature = input.temperature;
    }
    const {output} = await prompt(input, generateOptions);
    return output!;
  }
);

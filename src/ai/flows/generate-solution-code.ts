'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating C++ solution code for a given problem statement.
 *
 * - generateSolutionCode - A function that generates C++ solution code based on the problem statement.
 * - GenerateSolutionCodeInput - The input type for the generateSolutionCode function.
 * - GenerateSolutionCodeOutput - The return type for the generateSolutionCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSolutionCodeInputSchema = z.object({
  problemStatement: z
    .string()
    .describe('The problem statement for which to generate a solution.'),
});
export type GenerateSolutionCodeInput = z.infer<typeof GenerateSolutionCodeInputSchema>;

const GenerateSolutionCodeOutputSchema = z.object({
  solutionCode: z
    .string()
    .describe('The generated C++ solution code for the problem statement.'),
});
export type GenerateSolutionCodeOutput = z.infer<typeof GenerateSolutionCodeOutputSchema>;

export async function generateSolutionCode(input: GenerateSolutionCodeInput): Promise<GenerateSolutionCodeOutput> {
  return generateSolutionCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSolutionCodePrompt',
  input: {schema: GenerateSolutionCodeInputSchema},
  output: {schema: GenerateSolutionCodeOutputSchema},
  prompt: `You are an expert competitive programmer. Generate a C++ solution code for the following problem statement:\n\n{{{problemStatement}}}\n\nMake sure to include all necessary headers and the main function. The code should be well-formatted and easy to understand.`,
});

const generateSolutionCodeFlow = ai.defineFlow(
  {
    name: 'generateSolutionCodeFlow',
    inputSchema: GenerateSolutionCodeInputSchema,
    outputSchema: GenerateSolutionCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

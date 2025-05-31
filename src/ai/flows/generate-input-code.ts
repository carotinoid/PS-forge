// src/ai/flows/generate-input-code.ts
'use server';

/**
 * @fileOverview Generates C++ code for generating inputs based on a problem statement's input format.
 *
 * - generateInputCode - A function that generates C++ code to produce valid inputs.
 * - GenerateInputCodeInput - The input type for the generateInputCode function.
 * - GenerateInputCodeOutput - The return type for the generateInputCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInputCodeInputSchema = z.object({
  inputFormat: z
    .string()
    .describe(
      'A detailed description of the input format for a problem statement.'
    ),
  problemStatement: z.string().describe('The full problem statement.'),
});
export type GenerateInputCodeInput = z.infer<typeof GenerateInputCodeInputSchema>;

const GenerateInputCodeOutputSchema = z.object({
  cppCode: z
    .string()
    .describe('The C++ code that generates inputs conforming to the input format.'),
});
export type GenerateInputCodeOutput = z.infer<typeof GenerateInputCodeOutputSchema>;

export async function generateInputCode(input: GenerateInputCodeInput): Promise<GenerateInputCodeOutput> {
  return generateInputCodeFlow(input);
}

const generateInputCodePrompt = ai.definePrompt({
  name: 'generateInputCodePrompt',
  input: {schema: GenerateInputCodeInputSchema},
  output: {schema: GenerateInputCodeOutputSchema},
  prompt: `You are a C++ programming expert who specializes in generating input generation code based on a problem statement's specified input format.

  Given the following problem statement and input format, generate C++ code that produces valid inputs conforming to the input format.

  Problem Statement: {{{problemStatement}}}
  Input Format: {{{inputFormat}}}

  The generated code should be efficient, well-commented, and adhere to best practices.
  Make sure to include necessary header files.
  Do not use std::cin or any kind of user input, the code should generate the input randomly using srand(time(NULL)).
  `, 
});

const generateInputCodeFlow = ai.defineFlow(
  {
    name: 'generateInputCodeFlow',
    inputSchema: GenerateInputCodeInputSchema,
    outputSchema: GenerateInputCodeOutputSchema,
  },
  async input => {
    const {output} = await generateInputCodePrompt(input);
    return output!;
  }
);

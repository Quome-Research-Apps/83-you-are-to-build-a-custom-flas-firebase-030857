'use server';

/**
 * @fileOverview A flow to generate card suggestions based on user input.
 *
 * - generateCardSuggestions - A function that generates card suggestions.
 * - GenerateCardSuggestionsInput - The input type for the generateCardSuggestions function.
 * - GenerateCardSuggestionsOutput - The return type for the generateCardSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCardSuggestionsInputSchema = z.object({
  query: z
    .string()
    .describe("The query to generate card suggestions for."),
});

export type GenerateCardSuggestionsInput = z.infer<
  typeof GenerateCardSuggestionsInputSchema
>;

const GenerateCardSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe("The generated card suggestions."),
});

export type GenerateCardSuggestionsOutput = z.infer<
  typeof GenerateCardSuggestionsOutputSchema
>;

export async function generateCardSuggestions(
  input: GenerateCardSuggestionsInput
): Promise<GenerateCardSuggestionsOutput> {
  return generateCardSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCardSuggestionsPrompt',
  input: {schema: GenerateCardSuggestionsInputSchema},
  output: {schema: GenerateCardSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to help users create flashcards.
  Given the following query, generate relevant and useful suggestions for the user to add to their flashcard.
  Query: {{{query}}}
  Suggestions:`,
});

const generateCardSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateCardSuggestionsFlow',
    inputSchema: GenerateCardSuggestionsInputSchema,
    outputSchema: GenerateCardSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// lib/gpt.js
"use server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { getCategories } from "./vocab.js";

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OpenAI API key. Ensure OPENAI_API_KEY is set in your environment variables.");
  throw new Error("Missing OpenAI API key");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = "gpt-4o-mini";

// Define the expected structured output using Zod
const VocabCorrectionSchema = z.object({
  word: z.string().describe("The corrected Vietnamese word with proper accents."),
  translation: z.string().describe("The translation, modified only if the original is completely incorrect."),
  description: z.string().describe("Corrected description with proper Vietnamese accents and tones."),
  category: z.string().describe("A suitable category for this word based on existing ones, or a new one if needed."),
});

// Function to correct vocab using OpenAI API
export async function correctVocabEntry(word, translation, description, category) {
  // Get existing categories from the database
  const existingCategories = await getCategories();

  // Define the prompt
  const messages = [
    {
      role: "system",
      content: `
        You are a Vietnamese language assistant. Your job is to:
        1. Fix any incorrect accents in Vietnamese words (e.g., 'cam on' -> 'Cám Ơn').
        2. Correct accents and tones in the **description** if it contains Vietnamese text.
        3. Modify the English translation **ONLY** if the existing one is completely incorrect.
        4. Suggest the **most appropriate category** from this list: ${JSON.stringify(existingCategories)}.
        5. If no suitable category exists, suggest a **new one**.
      `,
    },
    {
      role: "user",
      content: `Correct the following vocabulary entry:
        Word: "${word}"
        Translation: "${translation}"
        Description: "${description || "None"}"
        Category: "${category || "None"}"
      `,
    },
  ];

  try {
    // Send request to OpenAI with structured output
    const completion = await openai.beta.chat.completions.create({
      model: model,
      messages,
      response_format: zodResponseFormat(VocabCorrectionSchema, "correction"),
    });

    return completion.choices[0].message.parsed;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return { word, translation, description, category }; // Fallback to original values
  }
}

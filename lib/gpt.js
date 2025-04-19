// lib/gpt.js
"use server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { getCategories } from "./vocab.js";

// Debug flag (set to `true` to enable logging, `false` to disable)
const debug = false;

// Define structured output schema using Zod
const VocabCorrectionSchema = z.object({
  word: z.string().describe("The corrected Vietnamese word with proper accents."),
  translation: z.string().describe("The translation, modified only if the existing one is completely incorrect."),
  description: z.string().describe("Corrected description that uses the provided Vietnamese word/phrase in a sentence with proper Vietnamese accents and tones and an English translation."),
  category: z.string().describe("A suitable category for this word based on existing ones, or a new one if needed."),
});

// Function to correct vocab using OpenAI API
export async function correctVocabEntry(word, translation, description = "", category = "") {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️ OPENAI_API_KEY not set. Skipping correction.");
    return { word, translation, description, category };
  }

  // Initialize OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = "gpt-4o-mini";

  try {
    if (debug) console.log("🛠 Fetching categories...");
    const existingCategories = await getCategories();

    // Merge existing categories with refined list, ensuring no duplicates
    const categorySet = new Set([
      ...existingCategories,
      "Greetings & Politeness", "Common Expressions", "Questions & Responses",
      "Family & Relationships", "Emotions & Feelings", "Numbers & Time", "Food & Drinks",
      "Travel & Transportation", "Shopping & Money", "Work & Business", "Education & Learning",
      "Health & Medicine", "Technology & Media", "Sports & Leisure", "Household & Daily Life",
      "Nature & Environment", "Laws & Government", "Religion & Spirituality", "Vietnamese Idioms",
      "Slang & Informal Speech"
    ]);

    const allCategories = Array.from(categorySet);

    // Define the structured prompt
    const messages = [
      {
        role: "system",
        content: `You are a Vietnamese language assistant. Your job is to:
          1️⃣ **Fix incorrect Vietnamese accents and tones** in the word (e.g., 'cam on' → 'Cám Ơn').
          2️⃣ **Modify the English translation** only if the existing one is completely incorrect, ensuring proper grammar and capitalization.
          3️⃣ **Choose the most relevant category** from this list, prioritizing specificity over generic labels: ${JSON.stringify(allCategories)}.
          4️⃣ **If no suitable category exists**, create a new one that accurately represents the word.
          5️⃣ **If no description is provided**, generate a simple sentence demonstrating usage of the Vietnamese word accompanied by an **English translation** of the Vietnamese sentence.
          6️⃣ **Ensure all Vietnamese text uses correct diacritics** for proper readability.
          7️⃣ **If either the Vietnamese word or the English translation is missing or blank, generate a suitable value for the missing part based on the provided non-empty field.**

          Return only the corrected word, translation, description, and category as structured output.
        `,
      },
      {
        role: "user",
        content: `Here is a vocabulary entry that needs correction:
          🔹 **Word**: "${word}"
          🔹 **Translation**: "${translation}"
          🔹 **Description**: "${description}"
          🔹 **Category**: "${category}"
          
          Please correct it and return structured output.
        `,
      },
    ];

    if (debug) console.log("🛠 Sending request to OpenAI...");
    const completion = await openai.chat.completions.create({
      model: model,
      messages,
      response_format: zodResponseFormat(VocabCorrectionSchema, "correction"),
    });

    if (debug) console.log("✅ Full OpenAI API Response:", JSON.stringify(completion, null, 2));

    // ✅ Extracting content manually
    const rawContent = completion.choices?.[0]?.message?.content;
    if (debug) console.log("✅ Raw Content:", rawContent);

    if (!rawContent) {
      console.error("❌ OpenAI returned empty content.");
      return { word, translation, description, category }; // Fallback
    }

    // ✅ Ensure content is parsed correctly
    const parsedResponse = JSON.parse(rawContent);
    if (debug) console.log("✅ Parsed OpenAI Correction:", JSON.stringify(parsedResponse, null, 2));

    return parsedResponse || { word, translation, description, category };
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    return { word, translation, description, category }; // Fallback to original values
  }
}

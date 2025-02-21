// lib/gpt.js
"use server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { getCategories } from "./vocab.js";

// Debug flag (set to `true` to enable logging, `false` to disable)
const debug = false;

// Ensure API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OpenAI API key. Ensure OPENAI_API_KEY is set in your environment variables.");
  throw new Error("Missing OpenAI API key");
}

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = "gpt-4o";

// Define structured output schema using Zod
const VocabCorrectionSchema = z.object({
  word: z.string().describe("The corrected Vietnamese word with proper accents."),
  translation: z.string().describe("The translation, modified only if the existing one is completely incorrect."),
  description: z.string().describe("Corrected description with proper Vietnamese accents and tones."),
  category: z.string().describe("A suitable category for this word based on existing ones, or a new one if needed."),
});

// Function to correct vocab using OpenAI API
export async function correctVocabEntry(word, translation, description = "", category = "") {
  try {
    if (debug) console.log("🛠 Fetching categories...");
    const existingCategories = await getCategories();

    // Define the structured prompt
    const messages = [
      {
        role: "system",
        content: `You are a Vietnamese language assistant. Your job is to:
          1️⃣ **Fix incorrect Vietnamese accents and tones** in the word (e.g., 'cam on' → 'Cám Ơn').
          2️⃣ **Fix incorrect accents and tones** in the description if it contains Vietnamese text.
          3️⃣ **Modify the English translation** if the existing one is completely incorrect and fix issues with syntax and capitalisation.
          4️⃣ **Suggest the best category** from this list: ${JSON.stringify(existingCategories)}.
          5️⃣ **If no suitable category exists, create a new one. Please try to keep the categories very simple and broad.**
          6️⃣ **Fix incorrect Vietnamese accents and tones in the description, if any.**
          7️⃣ **If no description has been provided give a very simple and short example of the vietnamese word being used in a sentence.**
          
          Return only the corrected word, translation, description, and category as structured JSON.
        `,
      },
      {
        role: "user",
        content: `Here is a vocabulary entry that needs correction:
          🔹 **Word**: "${word}"
          🔹 **Translation**: "${translation}"
          🔹 **Description**: "${description || "None"}"
          🔹 **Category**: "${category || "None"}"
          
          Please correct it and return structured JSON output.
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

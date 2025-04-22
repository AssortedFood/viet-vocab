// lib/vocab.js
"use server";
import { getDB } from "./db.js";
import { correctVocabEntry } from "./gpt.js";
import { textToSpeech } from "./elevenlabs.js";

// Helper function to ensure plain objects
function formatDBResult(result) {
  return { changes: result.changes || 0, lastID: result.lastID || null, success: result.changes > 0 || !!result.lastID };
}

// Fetch all vocab words with optional generic search
export async function getAllVocab({ sortBy = "createdAt", search = null }) {
  const db = await getDB();
  let query = `SELECT * FROM vocab`;
  const params = [];

  if (search) {
    query += ` WHERE word LIKE ? OR word_translation LIKE ? OR example LIKE ? OR example_translation LIKE ? OR category LIKE ?`;
    const likeSearch = `%${search}%`;
    params.push(likeSearch, likeSearch, likeSearch, likeSearch);
  }

  query += ` ORDER BY ${sortBy} DESC`;
  return db.all(query, params);
}


// Add a new vocabulary word
export async function addVocab(word, word_translation, example = "", example_translation = "", category = "") {
  if (!word && !word_translation) throw new Error("Either word or translation is required.");

  const db = await getDB();

  // Step 1: Insert the basic vocab entry (without audio)
  const result = await db.run(
    `INSERT INTO vocab (word, word_translation, example, example_translation, category) VALUES (?, ?, ?, ?, ?)`,
    [word, word_translation, example, example_translation, category]
  );
  const lastID = result.lastID;

  // Step 2: Correct the entry using OpenAI
  let correctedVocab;
  try {
    correctedVocab = await correctVocabEntry(word, word_translation, example, example_translation, category);
  } catch (error) {
    console.error("OpenAI correction failed:", error);
    // Proceed with original values if correction fails.
    correctedVocab = { word, word_translation, example, example_translation, category };
  }

  // Step 3: If corrections were made, update the database with the corrected text values
  if (
    correctedVocab.word !== word || 
    correctedVocab.word_translation !== word_translation || 
    correctedVocab.example !== example || 
    correctedVocab.example_translation !== example_translation || 
    correctedVocab.category !== category
  ) {
    await db.run(
      `UPDATE vocab SET word = ?, word_translation = ?, example = ?, example_translation = ?, category = ? WHERE id = ?`,
      [correctedVocab.word, correctedVocab.word_translation, correctedVocab.example, correctedVocab.example_translation, correctedVocab.category, lastID]
    );
  }

  // Step 4: Generate audio for the translated word and translated example using ElevenLabs
  let wordAudio = null;
  let exampleAudio = null;
  try {
    // Generate audio for the word
    wordAudio = await textToSpeech(correctedVocab.word);
    // Generate audio for the example if one is provided
    if (correctedVocab.example && correctedVocab.example.trim() !== "") {
      exampleAudio = await textToSpeech(correctedVocab.example);
    }
  } catch (error) {
    console.error("Text-to-speech conversion failed:", error);
    // Optionally, you can decide to fail the entire operation or simply continue without audio
  }

  // Step 5: Update the same row with the generated audio data
  await db.run(
    `UPDATE vocab SET word_audio = ?, example_audio = ? WHERE id = ?`,
    [wordAudio, exampleAudio, lastID]
  );

  return { lastID, success: true };
}

// Delete a vocabulary word by ID
export async function deleteVocab(id) {
  const db = await getDB();
  const result = await db.run(`DELETE FROM vocab WHERE id = ?`, [id]);
  return formatDBResult(result);
}

// Update familiarity score for a vocab word
export async function updateFamiliarity(id, score) {
  if (![1, 2, 3].includes(score)) {
    throw new Error("Invalid familiarity score. Must be 1 (😟), 2 (😐), or 3 (🙂).");
  }

  const db = await getDB();
  const result = await db.run(`UPDATE vocab SET familiarity = ? WHERE id = ?`, [score, id]);
  return formatDBResult(result);
}

// Get a list of the currently used Categories
export async function getCategories() {
  const db = await getDB();
  const result = await db.all(`SELECT DISTINCT category FROM vocab;`);
  return result.map(row => row.category);
}

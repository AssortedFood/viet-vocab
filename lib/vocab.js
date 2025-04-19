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
    query += ` WHERE word LIKE ? OR translation LIKE ? OR description LIKE ? OR category LIKE ?`;
    const likeSearch = `%${search}%`;
    params.push(likeSearch, likeSearch, likeSearch, likeSearch);
  }

  query += ` ORDER BY ${sortBy} DESC`;
  return db.all(query, params);
}


// Add a new vocabulary word
export async function addVocab(word, translation, description = "", category = "") {
  if (!word && !translation) throw new Error("Either word or translation is required.");

  const db = await getDB();

  // Step 1: Insert the basic vocab entry (without audio)
  const result = await db.run(
    `INSERT INTO vocab (word, translation, description, category) VALUES (?, ?, ?, ?)`,
    [word, translation, description, category]
  );
  const lastID = result.lastID;

  // Step 2: Correct the entry using OpenAI
  let correctedVocab;
  try {
    correctedVocab = await correctVocabEntry(word, translation, description, category);
  } catch (error) {
    console.error("OpenAI correction failed:", error);
    // Proceed with original values if correction fails.
    correctedVocab = { word, translation, description, category };
  }

  // Step 3: If corrections were made, update the database with the corrected text values
  if (
    correctedVocab.word !== word || 
    correctedVocab.translation !== translation || 
    correctedVocab.description !== description || 
    correctedVocab.category !== category
  ) {
    await db.run(
      `UPDATE vocab SET word = ?, translation = ?, description = ?, category = ? WHERE id = ?`,
      [correctedVocab.word, correctedVocab.translation, correctedVocab.description, correctedVocab.category, lastID]
    );
  }

  // Step 4: Generate audio for the corrected word and (optionally) description using ElevenLabs
  let wordAudio = null;
  let descriptionAudio = null;
  try {
    // Generate audio for the word
    wordAudio = await textToSpeech(correctedVocab.word);
    // Generate audio for the description if one is provided
    if (correctedVocab.description && correctedVocab.description.trim() !== "") {
      descriptionAudio = await textToSpeech(correctedVocab.description);
    }
  } catch (error) {
    console.error("Text-to-speech conversion failed:", error);
    // Optionally, you can decide to fail the entire operation or simply continue without audio
  }

  // Step 5: Update the same row with the generated audio data
  await db.run(
    `UPDATE vocab SET word_audio = ?, description_audio = ? WHERE id = ?`,
    [wordAudio, descriptionAudio, lastID]
  );

  return { lastID, success: true };
}

// Edit an existing vocabulary word
export async function editVocab(id, word, translation, description = "", category = "") {
  if (!id || !word || !translation) throw new Error("ID, word, and translation are required.");

  const db = await getDB();

  // Step 1: Fetch existing entry (optional, useful for debugging)
  const existingEntry = await db.get(`SELECT * FROM vocab WHERE id = ?`, [id]);
  if (!existingEntry) throw new Error(`Vocab entry with ID ${id} not found.`);

  console.log("🔍 Existing Entry Before Update:", existingEntry);

  // Step 2: Update the row without AI correction
  const result = await db.run(
    `UPDATE vocab SET word = ?, translation = ?, description = ?, category = ? WHERE id = ?`,
    [word, translation, description, category, id]
  );

  console.log("🛠 SQLite Update Result:", result);

  if (result.changes === 0) {
    console.error(`❌ No changes made in the database for ID ${id}.`);
  } else {
    console.log(`✅ Successfully updated vocab ID ${id}.`);
  }

  return formatDBResult(result);
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

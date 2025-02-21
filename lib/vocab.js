// lib/vocab.js
"use server";
import { getDB } from "./db.js";
import { correctVocabEntry } from "./gpt.js";

// Helper function to ensure plain objects
function formatDBResult(result) {
  return { changes: result.changes || 0, lastID: result.lastID || null, success: result.changes > 0 || !!result.lastID };
}

// Fetch all vocab words
export async function getAllVocab({ sortBy = "createdAt", category = null }) {
  const db = await getDB();
  let query = `SELECT * FROM vocab`;
  const params = [];

  if (category) {
    query += ` WHERE category LIKE ?`;
    params.push(`%${category}%`); // Allows partial matches
  }

  query += ` ORDER BY ${sortBy} DESC`;
  return db.all(query, params);
}

// Add a new vocabulary word
export async function addVocab(word, translation, description = "", category = "") {
  if (!word || !translation) throw new Error("Word and translation are required.");

  const db = await getDB();

  // Step 1: Insert into database
  const result = await db.run(
    `INSERT INTO vocab (word, translation, description, category) VALUES (?, ?, ?, ?)`,
    [word, translation, description, category]
  );
  const lastID = result.lastID;

  // Step 2: Try to correct the entry with OpenAI
  let correctedVocab;
  try {
    correctedVocab = await correctVocabEntry(word, translation, description, category);
  } catch (error) {
    console.error("OpenAI correction failed:", error);
    return { lastID, success: true }; // Return early if API fails
  }

  // Step 3: If corrections were made, update the database
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

  return { lastID, success: true };
}

// Edit an existing vocabulary word
export async function editVocab(id, word, translation, description = "", category = "") {
  if (!id || !word || !translation) throw new Error("ID, word, and translation are required.");

  const db = await getDB();

  // Step 1: Fetch existing entry (optional but useful for debugging)
  const existingEntry = await db.get(`SELECT * FROM vocab WHERE id = ?`, [id]);
  if (!existingEntry) throw new Error(`Vocab entry with ID ${id} not found.`);

  console.log("🔍 Existing Entry Before Update:", existingEntry);

  // Step 2: Directly update the database without AI correction
  const result = await db.run(
    `UPDATE vocab SET word = ?, translation = ?, description = ?, category = ? WHERE id = ?`,
    [word, translation, description, category, id]
  );

  console.log("🛠 SQLite Update Result:", result);

  // Step 3: Verify if the update actually happened
  if (result.changes === 0) {
    console.error(`❌ No changes made in the database for ID ${id}.`);
  } else {
    console.log(`✅ Successfully updated vocab ID ${id}.`);
  }

  return formatDBResult(result);
};


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
  const result = await db.all(`SELECT DISTINCT category FROM vocab;`)

  return result.map(row => row.category);
}
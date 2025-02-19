// lib/vocab.js
import { getDB } from "./db.js";

// Fetch all vocab words with optional sorting and category filtering
export async function getAllVocab({ sortBy = "createdAt", category = null }) {
  const db = await getDB();
  let query = `SELECT * FROM vocab`;
  const params = [];

  if (category) {
    query += ` WHERE category = ?`;
    params.push(category);
  }

  query += ` ORDER BY ${sortBy} DESC`;
  
  return db.all(query, params);
}

// Add a new vocabulary word
export async function addVocab(word, translation, description = "", category = "") {
  if (!word || !translation) {
    throw new Error("Word and translation are required.");
  }

  const db = await getDB();
  return db.run(
    `INSERT INTO vocab (word, translation, description, category) VALUES (?, ?, ?, ?)`,
    [word, translation, description, category]
  );
}

// Delete a vocabulary word by ID
export async function deleteVocab(id) {
  const db = await getDB();
  return db.run(`DELETE FROM vocab WHERE id = ?`, [id]);
}

// Update familiarity score for a vocab word
export async function updateFamiliarity(id, score) {
  if (![1, 2, 3].includes(score)) {
    throw new Error("Invalid familiarity score. Must be 1 (😟), 2 (😐), or 3 (🙂).");
  }

  const db = await getDB();
  return db.run(`UPDATE vocab SET familiarity = ? WHERE id = ?`, [score, id]);
}

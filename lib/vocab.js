// lib/vocab.js
"use server";
import { getDB } from "./db.js";

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
    query += ` WHERE category = ?`;
    params.push(category);
  }

  query += ` ORDER BY ${sortBy} DESC`;
  return db.all(query, params);
}

// Add a new vocabulary word
export async function addVocab(word, translation, category = "") {
  if (!word || !translation) throw new Error("Word and translation are required.");

  const db = await getDB();
  const result = await db.run(
    `INSERT INTO vocab (word, translation, category) VALUES (?, ?, ?, ?)`,
    [word, translation, category]
  );

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
  const result = await db.all(`SELECT DISTINCT category FROM vocab;`)

  return result.map(row => row.category);
}
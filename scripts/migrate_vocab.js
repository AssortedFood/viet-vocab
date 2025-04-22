#!/usr/bin/env node
// scripts/migrate_vocab.js

import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
// adjust this path if your layout differs
import { textToSpeech } from "../lib/elevenlabs.js";

async function migrate() {
  const oldPath = path.join(process.cwd(), "data", "vocab.db");
  const newPath = path.join(process.cwd(), "data", "updated_vocab.db");

  // 0) Remove any previous run
  if (fs.existsSync(newPath)) {
    console.log(`Removing existing DB at ${newPath}`);
    fs.unlinkSync(newPath);
  }

  console.log(`Opening old DB at ${oldPath}`);
  const oldDb = await open({ filename: oldPath, driver: sqlite3.Database });

  console.log(`Creating new DB at ${newPath}`);
  const newDb = await open({ filename: newPath, driver: sqlite3.Database });

  // 1) Create your new schema
  await newDb.exec(`
    CREATE TABLE IF NOT EXISTS vocab (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      word_translation TEXT NOT NULL,
      example TEXT NOT NULL,
      example_translation TEXT NOT NULL,
      category TEXT DEFAULT '',
      word_audio BLOB,
      example_audio BLOB,
      familiarity INTEGER DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2) Read every row from the old table
  const rows = await oldDb.all(`
    SELECT
      id,
      word,
      translation         AS word_translation,
      description,
      category,
      word_audio,
      familiarity,
      createdAt
    FROM vocab
    ORDER BY id
  `);

  console.log(`Migrating ${rows.length} rows with fresh TTS…`);

  const insertStmt = `
    INSERT INTO vocab
      (id, word, word_translation, example, example_translation, category, word_audio, example_audio, familiarity, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const row of rows) {
    // ✂️  split description → example + example_translation
    const raw = row.description ?? "";
    const idx = raw.indexOf("(");
    if (idx === -1) {
      throw new Error(`Row ${row.id}: missing "(" in description: "${raw}"`);
    }
    const example = raw.slice(0, idx).trimEnd();
    const right = raw.slice(idx);
    if (!right.endsWith(")")) {
      throw new Error(`Row ${row.id}: description does not end with ")": "${raw}"`);
    }
    const example_translation = right.slice(1, -1);

    // 🔊  generate new audio for the example text
    let exampleAudio = null;
    try {
      exampleAudio = await textToSpeech(example);
    } catch (ttsErr) {
      console.error(`⚠️  TTS failed for row ${row.id} (“${example}”):`, ttsErr);
      // continue with exampleAudio = null
    }

    // 3) Insert into the new table
    await newDb.run(insertStmt, [
      row.id,
      row.word,
      row.word_translation,
      example,
      example_translation,
      row.category,
      row.word_audio,
      exampleAudio,
      row.familiarity,
      row.createdAt,
    ]);
  }

  console.log("✅ Migration complete.");
  await oldDb.close();
  await newDb.close();
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});

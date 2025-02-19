// lib/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// Open SQLite database connection
const dbPromise = open({
  filename: path.join(process.cwd(), "data", "vocab.db"), // Ensure correct path
  driver: sqlite3.Database,
});

// Function to get database instance
export async function getDB() {
  return dbPromise;
}

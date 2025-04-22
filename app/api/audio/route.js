// app/api/audio/route.js
"use server";
import { getDB } from "../../../lib/db.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) {
      return new Response("Missing id or type parameter.", { status: 400 });
    }

    const db = await getDB();
    // Query the specific audio column for the given vocab id.
    const row = await db.get(`SELECT ${type} FROM vocab WHERE id = ?`, [id]);
    if (!row || !row[type]) {
      return new Response("Audio not found.", { status: 404 });
    }

    // Return the audio blob (assumed to be stored as binary data)
    return new Response(row[type], {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" }
    });
  } catch (error) {
    console.error("Error fetching audio:", error);
    return new Response("Server error", { status: 500 });
  }
}

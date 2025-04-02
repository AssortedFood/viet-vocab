// app/api/vocab/all/route.js
"use server";

import { getDB } from "../../../../lib/db.js";

export async function GET() {
  try {
    const db = await getDB();
    const all = await db.all("SELECT * FROM vocab ORDER BY createdAt DESC");
    return Response.json(all, { status: 200 });
  } catch (err) {
    console.error("❌ Failed to fetch all vocab:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

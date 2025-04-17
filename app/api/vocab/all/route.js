// app/api/vocab/all/route.js
"use server";

import { getDB } from "../../../../lib/db.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const includeAudio = searchParams.get("includeAudio") === "true";

    const db = await getDB();
    let rows;
    if (includeAudio) {
      // old behaviour: grab everything
      rows = await db.all("SELECT * FROM vocab ORDER BY createdAt DESC");
    } else {
      // new: only select the fields you need to render the list
      rows = await db.all(`
        SELECT
          id,
          word,
          translation,
          description,
          category,
          familiarity,
          createdAt
        FROM vocab
        ORDER BY createdAt DESC
      `);
    }

    return Response.json(rows, { status: 200 });
  } catch (err) {
    console.error("❌ Failed to fetch vocab:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

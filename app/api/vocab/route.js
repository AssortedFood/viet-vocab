// app/api/vocab/route.js
"use server";
import { getAllVocab, addVocab, deleteVocab, updateFamiliarity } from "../../../lib/vocab";

// Handle GET request - Fetch vocab list
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    
    // ✅ Updated to use generic search query instead of category
    const search = searchParams.get("search") || null;
    const vocab = await getAllVocab({ sortBy, search });

    return Response.json(vocab, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching vocab:", error);
    return Response.json({ error: "Failed to fetch vocab" }, { status: 500 });
  }
}

// Handle POST request - Add new vocab entry
export async function POST(req) {
  try {
    const { word, word_translation, example = "", example_translation = "", category = "" } = await req.json();

    if (!word && !word_translation) {
      return Response.json({ error: "Either word or translation is required." }, { status: 400 });
    }

    const result = await addVocab(word, word_translation, example, example_translation, category);
    return Response.json({ success: true, lastID: result.lastID }, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding vocab:", error);
    return Response.json({ error: "Failed to add vocab" }, { status: 500 });
  }
}

// Handle DELETE request - Remove vocab entry
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Missing vocab ID." }, { status: 400 });
    }

    await deleteVocab(id);
    return Response.json({ success: true, deletedID: id }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting vocab:", error);
    return Response.json({ error: "Failed to delete vocab" }, { status: 500 });
  }
}

// Handle PUT request - Update familiarity score
export async function PUT(req) {
  try {
    const { id, score } = await req.json();

    if (!id || ![1, 2, 3].includes(score)) {
      return Response.json({ error: "Invalid ID or familiarity score." }, { status: 400 });
    }

    await updateFamiliarity(id, score);
    return Response.json({ success: true, updatedID: id }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating familiarity:", error);
    return Response.json({ error: "Failed to update familiarity" }, { status: 500 });
  }
}

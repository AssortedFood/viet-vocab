// app/api/vocab/route.js
import { getAllVocab, addVocab, deleteVocab, updateFamiliarity } from "@/lib/vocab";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const category = searchParams.get("category") || null;
  const vocab = await getAllVocab({ sortBy, category });

  return Response.json(vocab);
}

export async function POST(req) {
  const { word, translation, description, category } = await req.json();
  const result = await addVocab(word, translation, description, category);
  return Response.json({ success: true, lastID: result.lastID });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const result = await deleteVocab(id);
  return Response.json({ success: true, deletedID: id });
}

export async function PUT(req) {
  const { id, score } = await req.json();
  const result = await updateFamiliarity(id, score);
  return Response.json({ success: true, updatedID: id });
}

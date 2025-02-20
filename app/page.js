// app/vocab/page.js
"use client";
import { useState, useEffect, useRef } from "react";
import { addVocab, getAllVocab, deleteVocab, updateFamiliarity } from "@/lib/vocab";

export default function VocabPage() {
  const [vocabList, setVocabList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("createdAt");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [newWord, setNewWord] = useState({ word: "", translation: "", description: "", category: "" });
  const observer = useRef(null);

  useEffect(() => {
    loadVocab();
  }, [sortBy, categoryFilter]);

  const loadVocab = async () => {
    setLoading(true);
    const data = await getAllVocab({ sortBy, category: categoryFilter || null });
    setVocabList(data);
    setLoading(false);
  };

  const handleAddVocab = async () => {
    if (!newWord.word || !newWord.translation) return;
    await addVocab(newWord.word, newWord.translation, newWord.description, newWord.category);
    setNewWord({ word: "", translation: "", description: "", category: "" });
    loadVocab();
  };

  const handleDeleteVocab = async (id) => {
    await deleteVocab(id);
    setVocabList(vocabList.filter((word) => word.id !== id));
  };

  const handleFamiliarityUpdate = async (id, score) => {
    await updateFamiliarity(id, score);
    setVocabList(vocabList.map((word) => (word.id === id ? { ...word, familiarity: score } : word)));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>

      {/* Add New Word Section */}
      <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "20px" }}>
        <h2>Add a New Word</h2>
        <input
          type="text"
          placeholder="Vietnamese"
          value={newWord.word}
          onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
          style={{ width: "100%", marginBottom: "5px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="English Translation"
          value={newWord.translation}
          onChange={(e) => setNewWord({ ...newWord, translation: e.target.value })}
          style={{ width: "100%", marginBottom: "5px", padding: "5px" }}
        />
        <button onClick={handleAddVocab} style={{ width: "100%", padding: "10px", background: "#007bff", color: "#fff", border: "none" }}>
          ➕ Add Word
        </button>
      </div>

      {/* Sorting & Filtering */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Sort by: Date Added</option>
          <option value="familiarity">Sort by: Familiarity</option>
          <option value="category">Sort by: Category</option>
        </select>

        <input
          type="text"
          placeholder="Filter by Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: "5px" }}
        />
      </div>

      {/* Vocabulary List */}
      {loading && <p>Loading...</p>}
      {!loading && vocabList.length === 0 && <p>No words found.</p>}
      <div>
        {vocabList.map((word) => (
          <div key={word.id} style={{ borderBottom: "1px solid #ddd", padding: "10px 0", display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <strong>{word.word}</strong> → {word.translation}
              <br />
              <small>{word.description}</small>
              <br />
              <em>Category: {word.category || "None"}</em>
            </div>
            <div>
              <button onClick={() => handleFamiliarityUpdate(word.id, 1)}>😟</button>
              <button onClick={() => handleFamiliarityUpdate(word.id, 2)}>😐</button>
              <button onClick={() => handleFamiliarityUpdate(word.id, 3)}>🙂</button>
            </div>
            <button onClick={() => handleDeleteVocab(word.id)} style={{ marginLeft: "10px", color: "red", border: "none", background: "none" }}>
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

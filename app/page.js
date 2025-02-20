// app/vocab/page.js
"use client";
import { useState, useEffect } from "react";

export default function VocabPage() {
  const [vocabList, setVocabList] = useState(null); // Ensures SSR & Client match
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("createdAt");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [newWord, setNewWord] = useState({ word: "", translation: "", description: "", category: "" });
  const [showAddWord, setShowAddWord] = useState(false);

  useEffect(() => {
    loadVocab();
  }, [sortBy, categoryFilter]);

  // Fetch vocab from API
  const loadVocab = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vocab?sortBy=${sortBy}&category=${categoryFilter}`);
      const data = await res.json();
      setVocabList(data);
    } catch (error) {
      console.error("Error loading vocab:", error);
    }
    setLoading(false);
  };

  // Add new vocab via API
  const handleAddVocab = async () => {
    if (!newWord.word || !newWord.translation) return;

    try {
      await fetch("/api/vocab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWord),
      });

      setNewWord({ word: "", translation: "", description: "", category: "" });
      setShowAddWord(false); // Close form after adding
      loadVocab(); // Refresh vocab list
    } catch (error) {
      console.error("Error adding vocab:", error);
    }
  };

  // Delete vocab via API
  const handleDeleteVocab = async (id) => {
    try {
      await fetch(`/api/vocab?id=${id}`, { method: "DELETE" });
      setVocabList((prevList) => prevList.filter((word) => word.id !== id));
    } catch (error) {
      console.error("Error deleting vocab:", error);
    }
  };

  // Update familiarity via API
  const handleFamiliarityUpdate = async (id, score) => {
    try {
      await fetch("/api/vocab", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, score }),
      });

      setVocabList((prevList) =>
        prevList.map((word) => (word.id === id ? { ...word, familiarity: score } : word))
      );
    } catch (error) {
      console.error("Error updating familiarity:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>📖 Your Vocabulary List</h1>

      {/* Toggle Add Word Form Button */}
      <button
        onClick={() => setShowAddWord(!showAddWord)}
        style={{ width: "100%", padding: "10px", background: "#007bff", color: "#fff", border: "none", marginBottom: "10px" }}>
        {showAddWord ? "✖ Close" : "➕ Add New Word"}
      </button>

      {/* Add New Word Section */}
      {showAddWord && (
        <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "20px" }}>
          <h4>Add a New Word</h4>
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
          <input
            type="text"
            placeholder="Description (optional)"
            value={newWord.description}
            onChange={(e) => setNewWord({ ...newWord, description: e.target.value })}
            style={{ width: "100%", marginBottom: "5px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={newWord.category}
            onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
          <button
            onClick={handleAddVocab}
            style={{ width: "100%", padding: "10px", background: "#28a745", color: "#fff", border: "none" }}>
            ➕ Add Word
          </button>
        </div>
      )}

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

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Error Handling */}
      {!loading && vocabList === null && <p>Error loading vocabulary.</p>}
      {!loading && vocabList?.length === 0 && <p>No words found.</p>}

      {/* Vocabulary List */}
      {!loading && vocabList && (
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
              <button
                onClick={() => handleDeleteVocab(word.id)}
                style={{ marginLeft: "10px", color: "red", border: "none", background: "none" }}>
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

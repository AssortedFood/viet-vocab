"use client";
import { useState, useEffect } from "react";
import { Container, Button, CircularProgress } from "@mui/material";
import SearchBar from "./components/SearchBar";
import AddVocabForm from "./components/AddVocabForm";
import VocabList from "./components/VocabList";
import { removeDiacritics } from "../lib/utils";

export default function VocabPage() {
  const [allVocab, setAllVocab] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredVocab, setFilteredVocab] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWord, setNewWord] = useState({ word: "", translation: "", description: "", category: "" });
  const [showAddWord, setShowAddWord] = useState(false);
  const [editingWordId, setEditingWordId] = useState(null);
  const [editingWord, setEditingWord] = useState(null);

  useEffect(() => {
    fetchAllVocab();
  }, []);

  useEffect(() => {
    const q = removeDiacritics(query.trim().toLowerCase());
    setFilteredVocab(
      allVocab.filter((entry) =>
        ["word", "translation", "description", "category"].some((field) =>
          removeDiacritics((entry[field] || "").toLowerCase()).includes(q)
        )
      )
    );
  }, [query, allVocab]);

  const fetchAllVocab = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vocab/all");
      const data = await res.json();
      setAllVocab(data);
    } catch (error) {
      console.error("Error fetching vocab:", error);
    }
    setLoading(false);
  };

  const playAudio = async (id, type) => {
    try {
      const response = await fetch(`/api/audio?id=${id}&type=${type}`);
      if (!response.ok) throw new Error("Audio fetch failed");
      const arrayBuffer = await response.arrayBuffer();
      const audio = new Audio(URL.createObjectURL(new Blob([arrayBuffer], { type: "audio/mpeg" })));
      audio.play();
    } catch (err) {
      console.error("Error playing audio:", err);
    }
  };

  const handleAddVocab = async () => {
    if (!newWord.word || !newWord.translation) return;
    try {
      await fetch("/api/vocab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWord),
      });
      setNewWord({ word: "", translation: "", description: "", category: "" });
      setShowAddWord(false);
      fetchAllVocab();
    } catch (err) {
      console.error("Error adding vocab:", err);
    }
  };

  const handleDeleteVocab = async (id) => {
    try {
      await fetch(`/api/vocab?id=${id}`, { method: "DELETE" });
      fetchAllVocab();
    } catch (err) {
      console.error("Error deleting vocab:", err);
    }
  };

  const startEditing = (vocab) => {
    setEditingWordId(vocab.id);
    setEditingWord({ ...vocab });
  };

  const handleEditChange = (field, value) => {
    setEditingWord((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async (id) => {
    if (!editingWord.word || !editingWord.translation) return;
    try {
      const res = await fetch("/api/vocab", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editingWord }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("Edit failed:", err);
        return;
      }
      setEditingWordId(null);
      setEditingWord(null);
      fetchAllVocab();
    } catch (err) {
      console.error("Error saving vocab:", err);
    }
  };

  const cancelEditing = () => {
    setEditingWordId(null);
    setEditingWord(null);
  };

  return (
    <Container sx={{ padding: 2, backgroundColor: "background.default", minHeight: "100vh" }}>
      <Button
        variant="contained"
        onClick={() => setShowAddWord(!showAddWord)}
        fullWidth
        sx={{ mb: 2 }}
      >
        {showAddWord ? "Close" : "Add New Vocab"}
      </Button>

      {showAddWord && (
        <AddVocabForm newWord={newWord} setNewWord={setNewWord} handleAddVocab={handleAddVocab} />
      )}

      <SearchBar query={query} setQuery={setQuery} />

      {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
      {!loading && filteredVocab.length === 0 && <p>No words found.</p>}

      <VocabList
        vocabList={filteredVocab}
        editingWordId={editingWordId}
        editingWord={editingWord}
        startEditing={startEditing}
        handleEditChange={handleEditChange}
        handleEditSave={handleEditSave}
        cancelEditing={cancelEditing}
        handleDeleteVocab={handleDeleteVocab}
        playAudio={playAudio}
      />
    </Container>
  );
}

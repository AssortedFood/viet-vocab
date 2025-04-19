// app/components/VocabClient.js
"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Button,
  CircularProgress,
} from "@mui/material";

import SearchBar from "./SearchBar";
import AddVocabForm from "./AddVocabForm";
import VocabList from "./VocabList";
import { removeDiacritics } from "../../lib/utils";

export default function VocabClient() {
  const [allVocab, setAllVocab] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredVocab, setFilteredVocab] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWord, setNewWord] = useState({
    word: "",
    translation: "",
    description: "",
    category: "",
  });
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

  async function fetchAllVocab() {
    setLoading(true);
    try {
      const res = await globalThis.fetch("/api/vocab/all?includeAudio=false");
      const data = await res.json();
      setAllVocab(data);
    } catch (err) {
      console.error("Error fetching vocab:", err);
    }
    setLoading(false);
  }

  async function playAudio(id, type) {
    try {
      const res = await globalThis.fetch(`/api/audio?id=${id}&type=${type}`);
      if (!res.ok) throw new Error("Audio fetch failed");
      const buffer = await res.arrayBuffer();
      const url = URL.createObjectURL(new Blob([buffer], { type: "audio/mpeg" }));
      new Audio(url).play();
    } catch (err) {
      console.error("Error playing audio:", err);
    }
  }

  async function handleAddVocab() {
    if (!newWord.word && !newWord.translation) return;
    try {
      await globalThis.fetch("/api/vocab", {
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
  }

  async function handleDeleteVocab(id) {
    try {
      await globalThis.fetch(`/api/vocab?id=${id}`, { method: "DELETE" });
      fetchAllVocab();
    } catch (err) {
      console.error("Error deleting vocab:", err);
    }
  }

  function startEditing(vocab) {
    setEditingWordId(vocab.id);
    setEditingWord({ ...vocab });
  }

  function handleEditChange(field, value) {
    setEditingWord((prev) => ({ ...prev, [field]: value }));
  }

  async function handleEditSave(id) {
    if (!editingWord.word || !editingWord.translation) return;
    try {
      const res = await globalThis.fetch("/api/vocab", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editingWord }),
      });
      if (!res.ok) {
        console.error("Edit failed:", await res.json());
        return;
      }
      setEditingWordId(null);
      setEditingWord(null);
      fetchAllVocab();
    } catch (err) {
      console.error("Error saving vocab:", err);
    }
  }

  function cancelEditing() {
    setEditingWordId(null);
    setEditingWord(null);
  }

  return (
    <Container sx={{ p: 2, backgroundColor: "background.default", minHeight: "100vh" }}>
      <Button
        variant="contained"
        onClick={() => setShowAddWord((s) => !s)}
        fullWidth
        sx={{ mb: 2 }}
      >
        {showAddWord ? "Close" : "Add New Vocab"}
      </Button>

      {showAddWord && (
        <AddVocabForm
          newWord={newWord}
          setNewWord={setNewWord}
          handleAddVocab={handleAddVocab}
        />
      )}

      <SearchBar query={query} setQuery={setQuery} />

      {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />}
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

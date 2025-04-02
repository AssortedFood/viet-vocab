"use client";
import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress
} from "@mui/material";
import { Add, Edit, Delete, VolumeUp } from "@mui/icons-material";
import { removeDiacritics } from "../lib/utils"; // <-- make sure this exists

export default function VocabPage() {
  const [allVocab, setAllVocab] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVocab, setFilteredVocab] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWord, setNewWord] = useState({
    word: "",
    translation: "",
    description: "",
    category: ""
  });
  const [showAddWord, setShowAddWord] = useState(false);
  const [editingWord, setEditingWord] = useState(null);

  useEffect(() => {
    fetchAllVocab();
  }, []);

  useEffect(() => {
    const q = removeDiacritics(searchQuery.trim().toLowerCase());
    setFilteredVocab(
      allVocab.filter((entry) =>
        ["word", "translation", "description", "category"].some((field) =>
          removeDiacritics((entry[field] || "").toLowerCase()).includes(q)
        )
      )
    );
  }, [searchQuery, allVocab]);

  const fetchAllVocab = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vocab/all");
      const data = await res.json();
      setAllVocab(data);
      setFilteredVocab(data);
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
        body: JSON.stringify(newWord)
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

  const handleFamiliarityUpdate = async (id, score) => {
    try {
      await fetch("/api/vocab", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, score })
      });
      fetchAllVocab();
    } catch (err) {
      console.error("Error updating familiarity:", err);
    }
  };

  const startEditing = (word) => setEditingWord({ ...word });

  const handleEditChange = (field, value) => {
    setEditingWord((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async (id) => {
    if (!editingWord.word || !editingWord.translation) return;
    try {
      const res = await fetch("/api/vocab", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editingWord })
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("Edit failed:", err);
        return;
      }
      setEditingWord(null);
      fetchAllVocab();
    } catch (err) {
      console.error("Error saving vocab:", err);
    }
  };

  return (
    <Container sx={{ padding: 2, backgroundColor: "background.default", minHeight: "100vh" }}>
      <Button
        variant="contained"
        startIcon={<Add />}
        fullWidth
        onClick={() => setShowAddWord(!showAddWord)}
        sx={{ mb: 2, bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
      >
        {showAddWord ? "Close" : "Add New Vocab"}
      </Button>

      {showAddWord && (
        <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "20px" }}>
          <TextField
            fullWidth
            label="Vietnamese"
            value={newWord.word}
            onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            fullWidth
            label="English Translation"
            value={newWord.translation}
            onChange={(e) => setNewWord({ ...newWord, translation: e.target.value })}
            sx={{ marginBottom: 1 }}
          />
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleAddVocab}
            sx={{
              marginBottom: "10px",
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" }
            }}
          >
            Add Vocab
          </Button>
        </div>
      )}

      <TextField
        fullWidth
        label="Search Vocabulary"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />

      {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
      {!loading && filteredVocab.length === 0 && <p>No words found.</p>}

      {filteredVocab.map((word) => (
        <Card key={word.id} sx={{ mb: 1, p: 1 }}>
          <CardContent>
            {editingWord?.id === word.id ? (
              <>
                <TextField
                  fullWidth
                  label="Vietnamese"
                  value={editingWord.word}
                  onChange={(e) => handleEditChange("word", e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="English Translation"
                  value={editingWord.translation}
                  onChange={(e) => handleEditChange("translation", e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={editingWord.description}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Category"
                  value={editingWord.category}
                  onChange={(e) => handleEditChange("category", e.target.value)}
                  sx={{ mb: 1 }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button variant="contained" onClick={() => handleEditSave(word.id)}>Save</Button>
                  <Button variant="outlined" onClick={() => setEditingWord(null)}>Cancel</Button>
                </div>
              </>
            ) : (
              <>
                <Typography variant="h6">
                  {word.word} → {word.translation}
                  <IconButton size="small" onClick={() => playAudio(word.id, "word_audio")}>
                    <VolumeUp fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {word.description}
                  <IconButton size="small" onClick={() => playAudio(word.id, "description_audio")}>
                    <VolumeUp fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="caption">
                  Category: {word.category || "None"}
                </Typography>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <IconButton color="primary" onClick={() => startEditing(word)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteVocab(word.id)}>
                    <Delete />
                  </IconButton>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
  
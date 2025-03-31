// app/vocab/page.js
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

export default function VocabPage() {
  const [vocabList, setVocabList] = useState(null); // Ensures SSR & Client match
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("createdAt");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [newWord, setNewWord] = useState({
    word: "",
    translation: "",
    description: "",
    category: ""
  });
  const [showAddWord, setShowAddWord] = useState(false);
  const [editingWord, setEditingWord] = useState(null); // Track editing state

  useEffect(() => {
    loadVocab();
  }, [sortBy, categoryFilter]);

  // Helper to play audio data stored as a Blob or Buffer.
  const playAudio = async (id, type) => {
    try {
      const response = await fetch(`/api/audio?id=${id}&type=${type}`);
      if (!response.ok) {
        console.error("Failed to fetch audio:", response.statusText);
        return;
      }
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Fetch vocab from API
  const loadVocab = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/vocab?sortBy=${sortBy}&category=${encodeURIComponent(categoryFilter)}`
      );
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
        body: JSON.stringify(newWord)
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
        body: JSON.stringify({ id, score })
      });
      setVocabList((prevList) =>
        prevList.map((word) => (word.id === id ? { ...word, familiarity: score } : word))
      );
    } catch (error) {
      console.error("Error updating familiarity:", error);
    }
  };

  // Enable editing mode for a vocab word
  const startEditing = (word) => {
    setEditingWord({ ...word });
  };

  // Handle input changes while editing
  const handleEditChange = (field, value) => {
    setEditingWord((prev) => ({ ...prev, [field]: value }));
  };

  // Save edited vocab entry via API
  const handleEditSave = async (id) => {
    if (!editingWord.word || !editingWord.translation) return;
    try {
      const res = await fetch("/api/vocab", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editingWord })
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Edit Error:", errorData);
        return;
      }
      setEditingWord(null); // Exit editing mode
      loadVocab(); // Refresh list to reflect changes
    } catch (error) {
      console.error("❌ Error updating vocab:", error);
    }
  };

  return (
    <Container
      sx={{
        padding: "20px",
        backgroundColor: "background.default",
        minHeight: "100vh", // Ensures it fills the screen
        overflowY: "auto" // Allows scrolling when expanded
      }}
    >
      {/* Toggle Add Vocab Form Button */}
      <Button
        variant="contained"
        startIcon={<Add />}
        fullWidth
        onClick={() => setShowAddWord(!showAddWord)}
        sx={{
          marginBottom: "10px",
          bgcolor: "primary.main",
          "&:hover": { bgcolor: "primary.dark" }
        }}
      >
        {showAddWord ? "Close" : "Add New Vocab"}
      </Button>

      {/* Add New Vocab Section */}
      {showAddWord && (
        <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "20px" }}>
          <TextField
            fullWidth
            label="Vietnamese"
            value={newWord.word}
            onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="English Translation"
            value={newWord.translation}
            onChange={(e) => setNewWord({ ...newWord, translation: e.target.value })}
            sx={{ marginBottom: "10px" }}
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

      {/* Category Filter - Full Width */}
      <TextField
        fullWidth
        label="Filter by Category"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        variant="outlined"
        sx={{ bgcolor: "background.paper", borderRadius: "5px", marginBottom: "10px" }}
      />

      {/* Loading State */}
      {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}

      {/* Error Handling */}
      {!loading && vocabList === null && <p>Error loading vocabulary.</p>}
      {!loading && vocabList?.length === 0 && <p>No words found.</p>}

      {/* Vocabulary List */}
      {(vocabList || []).map((word) => (
        <Card key={word.id} sx={{ marginBottom: "10px", padding: "10px" }}>
          <CardContent>
            {editingWord?.id === word.id ? (
              // If editing, show editable inputs
              <>
                <TextField
                  fullWidth
                  label="Vietnamese"
                  value={editingWord.word}
                  onChange={(e) => handleEditChange("word", e.target.value)}
                  sx={{ marginBottom: "5px" }}
                />
                <TextField
                  fullWidth
                  label="English Translation"
                  value={editingWord.translation}
                  onChange={(e) => handleEditChange("translation", e.target.value)}
                  sx={{ marginBottom: "5px" }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={editingWord.description}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  sx={{ marginBottom: "5px" }}
                />
                <TextField
                  fullWidth
                  label="Category"
                  value={editingWord.category}
                  onChange={(e) => handleEditChange("category", e.target.value)}
                  sx={{ marginBottom: "5px" }}
                />
                <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                  <Button variant="contained" color="primary" onClick={() => handleEditSave(word.id)}>
                    Save
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => setEditingWord(null)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              // Display mode: show text and audio buttons inline after the text
              <>
                <Typography variant="h6">
                  {word.word} → {word.translation}
                  <IconButton
                    size="small"
                    onClick={() => playAudio(word.id, "word_audio")}
                    sx={{ marginLeft: 0.5 }}
                  >
                    <VolumeUp fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {word.description}
                  <IconButton
                    size="small"
                    onClick={() => playAudio(word.id, "description_audio")}
                    sx={{ marginLeft: 0.5 }}
                  >
                    <VolumeUp fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="caption">
                  Category: {word.category || "None"}
                </Typography>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
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

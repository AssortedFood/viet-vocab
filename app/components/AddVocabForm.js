// app/components/AddVocabForm.js
import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function AddVocabForm({ newWord, setNewWord, handleAddVocab }) {
  const [validationError, setValidationError] = useState("");

  async function onClickAdd() {
    if (!newWord.word.trim() && !newWord.word_translation.trim()) {
      setValidationError("Please enter either a Vietnamese word or an English translation.");
      return;
    }

    setValidationError("");
    await handleAddVocab();
  }

  return (
    <Box sx={{ p: "10px", mb: "20px" }}>
      <TextField
        fullWidth
        label="Vietnamese Word"
        value={newWord.word}
        onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
        sx={{ marginBottom: 1 }}
      />
      <TextField
        fullWidth
        label="English Translation"
        value={newWord.word_translation}
        onChange={(e) => setNewWord({ ...newWord, word_translation: e.target.value })}
        sx={{ marginBottom: 1 }}
      />

      {validationError && (
        <Typography color="error" sx={{ mb: 1 }}>
          {validationError}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onClickAdd}
        sx={{ mb: 2, bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
      >
        Add Vocab
      </Button>
    </Box>
  );
}

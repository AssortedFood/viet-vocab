import { Card, CardContent, Typography, IconButton, TextField, Button } from "@mui/material";
import { Edit, Delete, VolumeUp } from "@mui/icons-material";

export default function VocabCard({
  vocab,
  editing,
  editingWord,
  startEditing,
  handleEditChange,
  handleEditSave,
  cancelEditing,
  handleDeleteVocab,
  playAudio,
}) {
  return (
    <Card sx={{ mb: 1, p: 1 }}>
      <CardContent>
        {editing ? (
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
              <Button variant="contained" onClick={() => handleEditSave(vocab.id)}>
                Save
              </Button>
              <Button variant="outlined" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <Typography variant="h6">
              {vocab.word} → {vocab.translation}
              <IconButton size="small" onClick={() => playAudio(vocab.id, "word_audio")}>
                <VolumeUp fontSize="small" />
              </IconButton>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {vocab.description}
              <IconButton size="small" onClick={() => playAudio(vocab.id, "description_audio")}>
                <VolumeUp fontSize="small" />
              </IconButton>
            </Typography>
            <Typography variant="caption">
              Category: {vocab.category || "None"}
            </Typography>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <IconButton color="primary" onClick={() => startEditing(vocab)}>
                <Edit />
              </IconButton>
              <IconButton color="secondary" onClick={() => handleDeleteVocab(vocab.id)}>
                <Delete />
              </IconButton>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

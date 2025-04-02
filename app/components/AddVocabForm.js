import { TextField, Button } from "@mui/material";

export default function AddVocabForm({ newWord, setNewWord, handleAddVocab }) {
  return (
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
        sx={{ mb: 2, bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
      >
        Add Vocab
      </Button>
    </div>
  );
}

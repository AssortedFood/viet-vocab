// app/components/VocabCard.js
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import { Delete, VolumeUp } from "@mui/icons-material";

export default function VocabCard({ vocab, handleDeleteVocab, playAudio }) {
  return (
    <Card sx={{ mb: 1, p: 1 }}>
      <CardContent>
        <Typography variant="h6">
          {vocab.word}
          <IconButton
            size="small"
            onClick={() => playAudio(vocab.id, "word_audio")}
            sx={{ ml: 1 }}
          >
            <VolumeUp fontSize="small" />
          </IconButton>
           → {vocab.word_translation}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          {vocab.example}
          <IconButton
            size="small"
            onClick={() => playAudio(vocab.id, "example_audio")}
            sx={{ ml: 1 }}
          >
            <VolumeUp fontSize="small" />
          </IconButton>
        </Typography>

        <Typography variant="body2" color="textSecondary">
          {vocab.example_translation}
        </Typography>

        <Typography
          variant="caption"
          component="div"
          sx={{ display: "flex", alignItems: "center", mt: 1 }}
        >
          <span>Category: {vocab.category || "None"}</span>
          <IconButton
            size="small"
            color="secondary"
            onClick={() => handleDeleteVocab(vocab.id)}
            sx={{ ml: "auto" }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Typography>
      </CardContent>
    </Card>
  );
}

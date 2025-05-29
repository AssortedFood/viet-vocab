// app/components/VocabCard.js
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Delete, VolumeUp } from "@mui/icons-material";

export default function VocabCard({ vocab, handleDeleteVocab, playAudio }) {
  return (
    <Card
      sx={{
        mb: 1,
        p: 1,
        // Slight transparency so background gradient peeks through
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.3),
      }}
    >
      <CardContent>
        <Typography variant="h6">
          {vocab.word}
          <IconButton
            size="small"
            onClick={() => playAudio(vocab.id, "word_audio")}
            sx={{ ml: 1 }}
          >
            <VolumeUp fontSize="small" />
          </IconButton>→ {vocab.word_translation}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          {vocab.example}
          <IconButton
            size="small"
            onClick={() => playAudio(vocab.id, "example_audio")}
            sx={{ ml: 1 }}
          >
            <VolumeUp fontSize="small" />
          </IconButton>→ {vocab.example_translation}
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

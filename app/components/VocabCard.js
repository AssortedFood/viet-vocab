// app/components/VocabCard.js
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import { Delete, VolumeUp } from "@mui/icons-material";

export default function VocabCard({
  vocab,
  handleDeleteVocab,
  playAudio,
}) {
  return (
    <Card sx={{ mb: 1, p: 1 }}>
      <CardContent>
        {
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
              <IconButton color="secondary" onClick={() => handleDeleteVocab(vocab.id)}>
                <Delete />
              </IconButton>
            </div>
          </>
        }
      </CardContent>
    </Card>
  );
}

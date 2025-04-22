// app/components/SearchBar.js
import { TextField } from "@mui/material";

export default function SearchBar({ query, setQuery }) {
  return (
    <TextField
      fullWidth
      label="Search Vocabulary"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      variant="outlined"
      sx={{ mb: 2 }}
    />
  );
}

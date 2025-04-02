// lib/useVocabSearch.js
import { useEffect, useState, useMemo } from "react";
import { removeDiacritics } from "./utils.js";

export function useVocabSearch() {
  const [allVocab, setAllVocab] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVocab = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/vocab/all");
        const data = await res.json();
        setAllVocab(data || []);
      } catch (err) {
        console.error("Error loading vocab:", err);
      }
      setLoading(false);
    };
    fetchVocab();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allVocab;

    const q = removeDiacritics(query.trim().toLowerCase());

    return allVocab.filter((entry) =>
      [entry.word, entry.translation, entry.description, entry.category]
        .filter(Boolean)
        .some(field => removeDiacritics(field.toLowerCase()).includes(q))
    );
  }, [query, allVocab]);

  return { filtered, setQuery, query, loading };
}

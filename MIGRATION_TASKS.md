# Migration Tasks Table

| Task | Subtask | Difficulty | Dependencies |
|------|---------|------------|--------------|
| **1. Database Schema & Migration** | Create new schema with updated columns | Low | None |
| | Migrate data via script | Medium | New schema created |
| | Rename and swap databases | Low | Data migration complete |
| **2. Data-access Layer** | Update getAllVocab SELECT statements | Medium | Database migration |
| | Update addVocab signature and implementation | Medium | Database migration |
| | Update editVocab for dual fields | Medium | Database migration |
| | Remove legacy description_audio code | Low | Updated addVocab/editVocab |
| **3. API Routes** | Update /api/vocab/all minimal fields | Low | Data-access layer updates |
| | Modify POST/PATCH payload handling | Medium | Data-access layer updates |
| | Add example_audio support to audio route | Low | Data-access layer updates |
| **4. GPT Correction** | Update Zod schema | Low | Data-access layer updates |
| | Modify prompt for dual fields | Medium | Updated Zod schema |
| | Update correctVocabEntry parsing | Medium | Updated prompt |
| **5. ElevenLabs TTS** | Implement example_audio generation | Low | Data-access layer updates |
| | Remove legacy English TTS code | Low | example_audio implementation |
| **6. Front-end Components** | Update global state management | Medium | API routes update |
| | Modify AddVocabForm for dual fields | High | Global state update |
| | Update VocabCard rendering | Medium | Global state update |
| | Update VocabClient POST/PATCH handling | Medium | VocabCard updates |
| **7. Hooks & Utils** | Update useVocabSearch filtering | Low | Front-end updates |
| | Verify utils compatibility | Low | None |
| **8. Tests** | Update API tests | High | API routes update |
| | Update audio endpoint tests | Medium | API routes update |
| | Update component tests | High | Front-end updates |
| | Update lib tests | High | Data-access layer updates |
| | Update GPT tests | Medium | GPT correction updates |
| **9. Documentation** | Update README schema docs | Low | All previous tasks |
| | Update TODO.md | Low | All previous tasks |
| | Remove legacy code comments | Low | All previous tasks |

## Difficulty Legend
- Low: ~1-2 hours
- Medium: ~2-4 hours
- High: 4+ hours

## Notes
- Tasks should be completed in order from top to bottom
- Each task may begin once its listed dependencies are complete
- Component tests should be updated alongside their respective component changes
- All changes should be validated with the test suite before moving to the next task

# Dual‑Field Migration Checklist

_Migrate from single `description` → dual fields (`example` + `example_translation`), update audio, backend, frontend, tests & docs._

---

## 🔧 1. Database schema & migration  
**Dependencies:** none  
**Difficulty:** ⚪ Low–Medium  

- [x] **Create new schema**  
  - Subtasks:  
    - Rename old table to `vocab_old`  
    - Create `vocab` with columns:  
      - `word_translation`, `example`, `example_translation`, `example_audio`  
    - Migrate rows via script  
    - Drop `vocab_old`  
- [ ] **Swap databases**  
  - Subtasks:  
    - Rename `updated_vocab.db` → `vocab.db`  
    - Remove old backup if desired  

---

## 🔧 2. Data‑access layer (`lib/vocab.js`)  
**Dependencies:** Step 1 complete  
**Difficulty:** ⚪ Medium  

- [ ] **`getAllVocab`**  
  - Subtasks: update SELECT to include new columns, remove old ones  
- [ ] **`addVocab`**  
  - Subtasks:  
    - Change signature to `(word, word_translation, example, example_translation, category)`  
    - Insert into new fields  
    - Generate `example_audio` via TTS  
- [ ] **`editVocab`**  
  - Subtasks: accept & update both text fields, optionally regenerate audio  
- [ ] **Cleanup**  
  - Remove code for old `description_audio`  

---

## 🔧 3. API routes  
**Dependencies:** Step 2 complete  
**Difficulty:** ⚪ Low–Medium  

- [ ] **`app/api/vocab/all/route.js`**  
  - Subtasks: update minimal‐fields SELECT  
- [ ] **`app/api/vocab/route.js`**  
  - Subtasks:  
    - POST/PATCH payload → four text fields  
    - Remove old description handling  
- [ ] **`app/api/audio/route.js`**  
  - Subtasks: support `type=example_audio`  

---

## 🔧 4. GPT correction (`lib/gpt.js`)  
**Dependencies:** Step 2 complete  
**Difficulty:** ⚪ Medium  

- [ ] **Zod schema**  
  - Subtasks: include `example` & `example_translation`  
- [ ] **Prompt**  
  - Subtasks: ask for separate Vietnamese example + English translation  
- [ ] **`correctVocabEntry`**  
  - Subtasks: parse new fields, drop old `description`  

---

## 🔧 5. ElevenLabs TTS (`lib/elevenlabs.js`)  
**Dependencies:** Step 2 complete  
**Difficulty:** ⚪ Low  

- [ ] **Generate `example_audio`**  
  - Subtasks: call `textToSpeech(example)`  
  - Store in new column  
- [ ] **Cleanup**  
  - Remove any old English‑desc TTS logic  

---

## 🔧 6. Front‑end components  
**Dependencies:** Steps 2–5 complete  
**Difficulty:** ⚪ Medium–High  

- [ ] **Global state**  
  - Subtasks: add `example`, `example_translation` to `useState`  
- [ ] **`AddVocabForm.js`**  
  - Subtasks: four inputs (word, translation, example, example_translation)  
- [ ] **`VocabCard.js`**  
  - Subtasks: render two text lines + two play buttons  
- [ ] **`VocabClient.js`**  
  - Subtasks: POST/PATCH with four fields; include both in search filter  

---

## 🔧 7. Hooks & utils  
**Dependencies:** Step 6 complete  
**Difficulty:** ⚪ Low  

- [ ] **`useVocabSearch.js`**  
  - Subtasks: include `example` + `example_translation` in filter  
- [ ] **`utils.js`**  
  - Subtasks: no change (diacritics removal works on all strings)  

---

## 🔧 8. Tests  
**Dependencies:** Steps 2–7 complete  
**Difficulty:** ⚪ High  

- [ ] **API tests**  
  - Update `vocabAll.test.js`, `vocabRoute.test.js` for new fields  
- [ ] **Audio tests**  
  - Update `audioRoute.test.js` to cover `example_audio`  
- [ ] **Component tests**  
  - Update `AddVocabForm.test.js`, `VocabCard.test.js`, `VocabClient.test.js`, `VocabList.test.js`  
- [ ] **Lib tests**  
  - Update `vocab.test.js`, `vocabEditDelete.test.js` for new signatures  
- [ ] **GPT fallback**  
  - Update `gpt.test.js` for `example` + `example_translation`  

---

## 🔧 9. Documentation & misc  
**Dependencies:** Steps 1–8 complete  
**Difficulty:** ⚪ Low  

- [ ] **`README.md`**: update schema & features to new fields  
- [ ] **`TODO.md`**: remove old description notes  
- [ ] **Cleanup**: delete legacy code/comments referencing `description`  

---

> **Notes:**  
> - Run migration script **after** updating schema.sql so your app migrations stay in sync.  
> - Tackle tasks in order: database → backend → API → AI layer → audio → frontend → hooks → tests → docs.  
> - Adjust difficulty:  
>   - ⚪ Low (~1–2 hrs)  
>   - ⚪ Medium (~2–4 hrs)  
>   - ⚪ High (4+ hrs)

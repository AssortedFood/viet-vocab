CREATE TABLE IF NOT EXISTS vocab (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,
    word_translation TEXT NOT NULL,
    example TEXT NOT NULL,
    example_translation TEXT NOT NULL,
    category TEXT DEFAULT '',
    word_audio BLOB,
    example_audio BLOB,
    familiarity INTEGER DEFAULT 0,  -- 0 = Not rated, 1 = 😟, 2 = 😐, 3 = 🙂
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
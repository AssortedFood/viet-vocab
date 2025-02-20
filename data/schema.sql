CREATE TABLE IF NOT EXISTS vocab (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT '',
    familiarity INTEGER DEFAULT 0,  -- 0 = Not rated, 1 = 😟, 2 = 😐, 3 = 🙂
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
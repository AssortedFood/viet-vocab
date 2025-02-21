# 📖 Viet Vocab App

A simple vocabulary learning app built with **Next.js (App Router)** and **SQLite**, designed to help learners improve their Vietnamese.

## Features
- **Add and View Vocabulary**: Enter words in Vietnamese with English translations and categories.
- **Automated Corrections**: New words are **automatically corrected** using AI to fix Vietnamese accents and suggest appropriate categories.
- **Infinite Scroll**: Seamlessly browse the vocabulary list.
- **Sorting & Filtering**: Sort by **date added, familiarity level, or category**. Filter words by category for focused learning.
- **Quiz Mode**: Self-score familiarity using three levels (😟 | 😐 | 🙂).
- **SQLite Direct Access**: No ORM—efficient and simple database management.

## Tech Stack
- **Next.js (App Router)**
- **SQLite (Direct Queries)**
- **OpenAI GPT** (for automatic vocabulary correction)

## Setup
```sh
git clone https://github.com/AssortedFood/viet-vocab.git
cd viet-vocab
npm install
npm run dev
```

## Self-Hosting Notes
- SQLite database (`vocab.db`) is stored in the `data/` directory.
- Ensure `OPENAI_API_KEY` is set in your environment for AI corrections.

📚 **Happy Learning!**
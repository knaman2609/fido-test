# Apple Notes Editor

A clean, Apple Notes-inspired markdown editor built with React and Milkdown.

## Features

- Create, edit, and delete notes
- Real-time markdown editing with syntax highlighting
- Search notes by content
- Clean, minimalist UI inspired by Apple Notes
- Local storage persistence
- Auto-save on edit
- Responsive sidebar with note list

## Tech Stack

- React 18
- TypeScript
- Milkdown (Markdown editor)
- Vite
- Zustand (State management)
- date-fns (Date formatting)
- Lucide React (Icons)
- UUID (Unique identifiers)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   ├── Editor/       # Markdown editor components
│   ├── EmptyState/   # Empty state view
│   ├── NoteItem/     # Individual note item
│   ├── NoteList/     # List of notes
│   ├── SearchBar/    # Search input
│   └── Sidebar/      # Sidebar container
├── hooks/            # Custom React hooks
├── store/            # Zustand stores
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Usage

1. Click the **New Note** button to create a note
2. Type in the editor - markdown syntax is supported
3. Use the search bar to find notes
4. Click on a note in the sidebar to select it
5. Notes are automatically saved to local storage

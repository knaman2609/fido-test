# Apple Notes Editor

A clean, Apple Notes-inspired markdown editor built with React and Milkdown.

## Features

- Create, edit, and delete notes
- Real-time markdown editing with syntax highlighting
- Search notes by content
- Clean, minimalist UI inspired by Apple Notes
- Local storage persistence

## Tech Stack

- React 18
- TypeScript
- Milkdown (Markdown editor)
- Vite
- Zustand (State management)
- Lucide React (Icons)
- date-fns (Date formatting)

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
├── components/     # React components
│   ├── Editor/     # Markdown editor components
│   ├── EmptyState/ # Empty state view
│   ├── NoteItem/   # Individual note item
│   ├── NoteList/   # List of notes
│   ├── SearchBar/  # Search input
│   └── Sidebar/    # Sidebar container
├── hooks/          # Custom hooks
├── store/          # Zustand stores
├── types/          # TypeScript types
└── utils/          # Utility functions
```

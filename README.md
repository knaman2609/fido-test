# BlockNote Editor

A clean, minimal single-document editor built with React, TypeScript, and BlockNote for a modern block-based editing experience.

## Features

- **Block-based editing** - Modern Notion-like editing experience with BlockNote
- **Rich text support** - Headings, lists, paragraphs, and more
- **Auto-save** - Content is automatically saved to localStorage
- **Persistent state** - Document content persists between sessions
- **Responsive design** - Works across different screen sizes

## Tech Stack

- **React 18.2.0** - UI library
- **TypeScript 5.0.0** - Type-safe JavaScript
- **Vite 5.4.0** - Fast build tool and dev server
- **BlockNote 0.15.0** - Block-based editor framework
- **Lucide React** - Beautiful icon library

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blocknote-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to the displayed local URL (typically `http://localhost:5173`)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (includes TypeScript compilation) |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Install dependencies and run TypeScript type checking |

## Project Structure

```
src/
├── components/          # React components
│   └── BlockNoteEditor/ # Main BlockNote editor component
├── utils/               # Utility functions
│   └── storage.ts       # Storage utilities
├── App.tsx              # Main application component
├── App.css              # Application styles
├── index.css            # Global styles
└── main.tsx             # Application entry point
```

## Usage

1. **Editing**: Start typing in the editor to create your document
2. **Auto-save**: Your content is automatically saved to localStorage
3. **Block Types**: Use the slash menu (type `/`) to insert different block types

## License

MIT

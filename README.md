# Apple Notes Editor

A clean, minimal note-taking application inspired by Apple Notes, built with React, TypeScript, and Milkdown for rich markdown editing.

## Features

- **Create, edit, and delete notes** - Manage your notes with an intuitive interface
- **Rich text editing** - Markdown support via Milkdown editor
- **Real-time search** - Quickly find notes with instant search functionality
- **Dark/Light theme toggle** - Switch between themes for comfortable viewing
- **Landing page** - Welcoming first-time user experience
- **Sidebar navigation** - Organized note list with easy navigation
- **Responsive design** - Works across different screen sizes
- **Persistent state** - Notes and preferences are saved between sessions

## Tech Stack

- **React 18.2.0** - UI library
- **TypeScript 5.0.0** - Type-safe JavaScript
- **Vite 5.4.0** - Fast build tool and dev server
- **Milkdown 7.3.0** - Markdown editor framework
- **Zustand 4.4.0** - Lightweight state management
- **Lucide React** - Beautiful icon library
- **date-fns** - Date formatting utilities
- **uuid** - Unique identifier generation

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd apple-notes-editor
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
│   ├── Editor/         # Note editor components
│   ├── Sidebar/        # Sidebar navigation
│   ├── NoteList/       # List of notes display
│   ├── NoteItem/       # Individual note item
│   ├── SearchBar/      # Search functionality
│   ├── ThemeToggle/    # Dark/light mode toggle
│   ├── LandingPage/    # Welcome screen
│   └── EmptyState/     # Empty state display
├── store/              # Zustand state stores
│   ├── notesStore.ts   # Notes state management
│   ├── themeStore.ts   # Theme state management
│   └── landingStore.ts # Landing page state
├── hooks/              # Custom React hooks
│   └── useNotes.ts     # Notes-related hooks
├── types/              # TypeScript type definitions
│   └── note.ts         # Note type definitions
├── utils/              # Utility functions
│   └── date.ts         # Date formatting utilities
├── App.tsx             # Main application component
├── App.css             # Application styles
├── index.css           # Global styles
└── main.tsx            # Application entry point
```

## Usage

1. **Creating a Note**: Click the new note button in the sidebar to create a new note
2. **Editing**: Click on any note in the sidebar to open it in the editor
3. **Searching**: Use the search bar to filter notes by title or content
4. **Deleting**: Delete notes using the delete option in the note list
5. **Theme Toggle**: Switch between light and dark modes using the theme toggle button
6. **Markdown Support**: Use standard Markdown syntax in the editor for rich formatting

## License

MIT

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Note } from '@/types/note';

interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  addNote: () => string;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  getFilteredNotes: () => Note[];
  getSelectedNote: () => Note | null;
}

const extractTitle = (content: string): string => {
  const lines = content.split('\n');
  const firstLine = lines.find(line => line.trim().length > 0);
  if (!firstLine) return 'Untitled';
  return firstLine.replace(/^#+\s*/, '').trim() || 'Untitled';
};

const createDefaultNote = (): Note => {
  const now = new Date();
  return {
    id: uuidv4(),
    title: 'Untitled',
    content: '',
    createdAt: now,
    updatedAt: now,
  };
};

const sampleNotes: Note[] = [
  {
    id: uuidv4(),
    title: 'Markdown Test Document',
    content: `# Markdown Test Document

This document showcases all the markdown features supported by the editor.

## Text Formatting

**Bold text** and *italic text* and ~~strikethrough~~.

You can also use __bold__ and _italic_ with underscores.

## Headings

# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

## Lists

### Unordered Lists

- First item
- Second item
  - Nested item 1
  - Nested item 2
- Third item

### Ordered Lists

1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

### Task Lists

- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

## Code

Inline code: \`const x = 42\`

### Code Block

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

## Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> > Nested blockquotes are also supported.

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | Yes | H1-H6 |
| Lists | Yes | Ordered, unordered, tasks |
| Tables | Yes | GFM style |
| Code | Yes | Inline and blocks |

## Links

[OpenAI](https://openai.com)

## Horizontal Rules

---

## Mixed Content

> **Note:** This blockquote contains *formatted* text and a [link](https://example.com).

- List item with **bold** text
- List item with \`inline code\`
- List item with a [link](https://example.com)`,
    createdAt: new Date(Date.now() - 345600000),
    updatedAt: new Date(Date.now() - 259200000),
  },
  {
    id: uuidv4(),
    title: 'Welcome to Notes',
    content: '# Welcome to Notes\n\nThis is a simple, Apple Notes-inspired markdown editor.\n\n## Features\n\n- **Markdown support** with live preview\n- **Clean, minimal interface**\n- **Fast search** through your notes\n- **Auto-save** to local state\n\nStart typing to create your first note!',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: uuidv4(),
    title: 'Shopping List',
    content: '# Shopping List\n\n- [x] Milk\n- [x] Eggs\n- [ ] Bread\n- [ ] Butter\n- [ ] Coffee',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: uuidv4(),
    title: 'Project Ideas',
    content: '# Project Ideas\n\n1. Personal website redesign\n2. Mobile app for tracking habits\n3. Browser extension for productivity\n4. Open source contribution to React\n\n## Notes\n\nFocus on projects that solve real problems.',
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 172800000),
  },
];

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: sampleNotes,
  selectedNoteId: sampleNotes[0]?.id || null,
  searchQuery: '',

  addNote: () => {
    const newNote = createDefaultNote();
    set(state => ({
      notes: [newNote, ...state.notes],
      selectedNoteId: newNote.id,
    }));
    return newNote.id;
  },

  updateNote: (id, content) => {
    set(state => ({
      notes: state.notes.map(note =>
        note.id === id
          ? {
              ...note,
              content,
              title: extractTitle(content),
              updatedAt: new Date(),
            }
          : note
      ),
    }));
  },

  deleteNote: (id) => {
    set(state => {
      const newNotes = state.notes.filter(note => note.id !== id);
      const newSelectedId =
        state.selectedNoteId === id
          ? newNotes[0]?.id || null
          : state.selectedNoteId;
      return {
        notes: newNotes,
        selectedNoteId: newSelectedId,
      };
    });
  },

  selectNote: (id) => {
    set({ selectedNoteId: id });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  getFilteredNotes: () => {
    const { notes, searchQuery } = get();
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  },

  getSelectedNote: () => {
    const { notes, selectedNoteId } = get();
    return notes.find(note => note.id === selectedNoteId) || null;
  },
}));

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
    content: '# Markdown Test Document\n\nThis document showcases all the markdown features supported by the editor.\n\n## Text Formatting\n\n**Bold text** and *italic text* and ~~strikethrough~~.\n\nYou can also use __bold__ and _italic_ with underscores.\n\n## Headings\n\n# H1 Heading\n## H2 Heading\n### H3 Heading\n#### H4 Heading\n##### H5 Heading\n###### H6 Heading\n\n## Lists\n\n### Unordered Lists\n\n- First item\n- Second item\n  - Nested item 1\n  - Nested item 2\n- Third item\n\n### Ordered Lists\n\n1. First step\n2. Second step\n   1. Sub-step A\n   2. Sub-step B\n3. Third step\n\n### Task Lists\n\n- [x] Completed task\n- [ ] Pending task\n- [ ] Another pending task\n\n## Code\n\nInline code: `const x = 42`\n\n### Code Block\n\n```typescript\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n```\n\n## Blockquotes\n\n> This is a blockquote.\n> It can span multiple lines.\n>\n> > Nested blockquotes are also supported.\n\n## Tables\n\n| Feature | Supported | Notes |\n|---------|-----------|-------|\n| Headers | Yes | H1-H6 |\n| Lists | Yes | Ordered, unordered, tasks |\n| Tables | Yes | GFM style |\n| Code | Yes | Inline and blocks |\n\n## Links\n\n[OpenAI](https://openai.com)\n\n## Horizontal Rules\n\n---\n\n## Mixed Content\n\n> **Note:** This blockquote contains *formatted* text and a [link](https://example.com).\n\n- List item with **bold** text\n- List item with `inline code`\n- List item with a [link](https://example.com)',
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

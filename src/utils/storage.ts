import type { Note, StorageData, BlockNoteBlock, Theme } from '../types/note';

export const STORAGE_KEY = 'apple-notes-data';
export const THEME_STORAGE_KEY = 'apple-notes-theme';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function loadNotes(): Note[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: StorageData = JSON.parse(saved);
      if (Array.isArray(parsed.notes)) {
        return parsed.notes;
      }
    }
  } catch (error) {
    console.warn('Failed to load notes from localStorage:', error);
  }
  return [];
}

export function saveNotes(notes: Note[], lastSelectedNoteId?: string): void {
  try {
    const data: StorageData = { notes, lastSelectedNoteId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded. Notes too large to save.');
    } else {
      console.warn('Failed to save notes to localStorage:', error);
    }
  }
}

export function loadLastSelectedNoteId(): string | undefined {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: StorageData = JSON.parse(saved);
      return parsed.lastSelectedNoteId;
    }
  } catch (error) {
    console.warn('Failed to load last selected note:', error);
  }
  return undefined;
}

export function extractTitle(content: BlockNoteBlock[]): string {
  if (!Array.isArray(content) || content.length === 0) return 'Untitled';

  const firstBlock = content[0];
  if (!firstBlock || typeof firstBlock !== 'object') return 'Untitled';

  if (firstBlock.type === 'heading' && firstBlock.content) {
    if (typeof firstBlock.content === 'string') {
      return firstBlock.content.trim() || 'Untitled';
    }
    if (Array.isArray(firstBlock.content)) {
      const text = firstBlock.content
        .map((c) => {
          if (typeof c === 'string') return c;
          if (c && typeof c === 'object' && 'text' in c && typeof c.text === 'string') {
            return c.text;
          }
          return '';
        })
        .join('');
      return text.trim() || 'Untitled';
    }
  }

  if (firstBlock.type === 'paragraph' && firstBlock.content) {
    let text = '';
    if (typeof firstBlock.content === 'string') {
      text = firstBlock.content;
    } else if (Array.isArray(firstBlock.content)) {
      text = firstBlock.content
        .map((c) => {
          if (typeof c === 'string') return c;
          if (c && typeof c === 'object' && 'text' in c && typeof c.text === 'string') {
            return c.text;
          }
          return '';
        })
        .join('');
    }
    text = text.trim();
    if (text) {
      return text.length > 50 ? text.substring(0, 50) + '...' : text;
    }
  }

  return 'Untitled';
}

export function extractPreview(content: BlockNoteBlock[]): string {
  if (!Array.isArray(content) || content.length === 0) return '';

  let previewText = '';
  const blocksToCheck = content.slice(0, 3);

  for (const block of blocksToCheck) {
    if (!block || typeof block !== 'object') continue;
    
    if (block.content) {
      let text = '';
      if (typeof block.content === 'string') {
        text = block.content;
      } else if (Array.isArray(block.content)) {
        text = block.content
          .map((c) => {
            if (typeof c === 'string') return c;
            if (c && typeof c === 'object' && 'text' in c && typeof c.text === 'string') {
              return c.text;
            }
            return '';
          })
          .join('');
      }
      previewText += text + ' ';
    }
  }

  previewText = previewText.trim();
  if (previewText.length > 100) {
    previewText = previewText.substring(0, 100) + '...';
  }

  return previewText;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (dateDay.getTime() === today.getTime()) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  if (dateDay.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  const daysDiff = Math.floor((today.getTime() - dateDay.getTime()) / (24 * 60 * 60 * 1000));
  if (daysDiff < 7) {
    return date.toLocaleDateString([], { weekday: 'long' });
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function createDefaultNote(): Note {
  const now = Date.now();

  return {
    id: generateId(),
    title: 'Untitled',
    preview: '',
    content: [],
    createdAt: now,
    updatedAt: now,
    isPinned: false,
  };
}

export function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      return saved as Theme;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  return 'system';
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
}

export function formatFullDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getWordCount(content: BlockNoteBlock[]): number {
  let text = '';
  for (const block of content) {
    if (block.content) {
      if (typeof block.content === 'string') {
        text += block.content + ' ';
      } else if (Array.isArray(block.content)) {
        text += block.content
          .map((c) => (typeof c === 'string' ? c : 'text' in c ? c.text : ''))
          .join('') + ' ';
      }
    }
  }
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function groupNotesByDate(notes: Note[]): Record<string, Note[]> {
  const groups: Record<string, Note[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (const note of notes) {
    const noteDate = new Date(note.updatedAt);
    const noteDay = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());

    let groupKey: string;

    if (noteDay.getTime() === today.getTime()) {
      groupKey = 'Today';
    } else if (noteDay.getTime() === yesterday.getTime()) {
      groupKey = 'Yesterday';
    } else if (noteDay.getTime() > lastWeek.getTime()) {
      groupKey = 'Previous 7 Days';
    } else if (noteDay.getTime() > lastMonth.getTime()) {
      groupKey = 'Previous 30 Days';
    } else {
      groupKey = noteDate.toLocaleDateString([], { month: 'long', year: 'numeric' });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(note);
  }

  return groups;
}

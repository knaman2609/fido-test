import type { Note, StorageData, BlockNoteBlock } from '../types/note';

export const STORAGE_KEY = 'apple-notes-data';

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
  if (content.length === 0) return 'Untitled';

  const firstBlock = content[0];

  if (firstBlock.type === 'heading' && firstBlock.content) {
    if (typeof firstBlock.content === 'string') {
      return firstBlock.content.trim() || 'Untitled';
    }
    if (Array.isArray(firstBlock.content)) {
      const text = firstBlock.content.map((c) => c.text).join('');
      return text.trim() || 'Untitled';
    }
  }

  if (firstBlock.type === 'paragraph' && firstBlock.content) {
    let text = '';
    if (typeof firstBlock.content === 'string') {
      text = firstBlock.content;
    } else if (Array.isArray(firstBlock.content)) {
      text = firstBlock.content.map((c) => c.text).join('');
    }
    text = text.trim();
    if (text) {
      return text.length > 50 ? text.substring(0, 50) + '...' : text;
    }
  }

  return 'Untitled';
}

export function extractPreview(content: BlockNoteBlock[]): string {
  if (content.length === 0) return '';

  let previewText = '';
  const blocksToCheck = content.slice(0, 3);

  for (const block of blocksToCheck) {
    if (block.content) {
      let text = '';
      if (typeof block.content === 'string') {
        text = block.content;
      } else if (Array.isArray(block.content)) {
        text = block.content.map((c) => c.text).join('');
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
  const content: BlockNoteBlock[] = [
    {
      type: 'paragraph',
      content: 'Start typing...',
    },
  ];

  return {
    id: generateId(),
    title: 'Untitled',
    preview: 'Start typing...',
    content,
    createdAt: now,
    updatedAt: now,
  };
}

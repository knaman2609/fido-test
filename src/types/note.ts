import type { PartialBlock } from '@blocknote/core';

export type BlockNoteBlock = PartialBlock;

export interface Note {
  id: string;
  title: string;
  preview: string;
  content: BlockNoteBlock[];
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
}

export type Theme = 'light' | 'dark' | 'system';

export interface StorageData {
  notes: Note[];
  lastSelectedNoteId?: string;
  theme?: Theme;
}

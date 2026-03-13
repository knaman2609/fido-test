import type { PartialBlock } from '@blocknote/core';

export type BlockNoteBlock = PartialBlock;

export interface Note {
  id: string;
  title: string;
  preview: string;
  content: BlockNoteBlock[];
  createdAt: number;
  updatedAt: number;
}

export interface StorageData {
  notes: Note[];
  lastSelectedNoteId?: string;
}

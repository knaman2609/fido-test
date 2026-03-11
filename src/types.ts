import type { Block } from '@blocknote/core';

export type BlockData = Block;

export interface Document {
  id: string;
  title: string;
  blocks: Block[];
  createdAt: number;
  updatedAt: number;
}

export interface DocumentService {
  getCurrentDocument(): Document | null;
  load(): void;
  save(blocks: Block[]): void;
  updateTitle(title: string): void;
}

export interface DOMElements {
  editorContainer: HTMLDivElement;
  errorMessage: HTMLDivElement;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Document {
  id: string;
  title: string;
  blocks: any[];
  createdAt: number;
  updatedAt: number;
}

export interface DocumentService {
  getCurrentDocument(): Document | null;
  load(): void;
  save(blocks: any[]): void;
  updateTitle(title: string): void;
}

export interface DOMElements {
  editorContainer: HTMLDivElement;
  errorMessage: HTMLDivElement;
}

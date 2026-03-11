import type { Block } from "@blocknote/core";

export type Document = Block[];

export interface DocumentStorage {
  load(): Document | null;
  save(document: Document): void;
}

export interface SaveStatusElement {
  showSaved(): void;
  showError(message: string): void;
  showSaving(): void;
}

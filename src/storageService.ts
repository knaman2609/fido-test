import type { Block } from "@blocknote/core";

const STORAGE_KEY = "blocknote-document";

export interface DocumentStorage {
  load(): Block[] | null;
  save(blocks: Block[]): void;
}

class DocumentStorageImpl implements DocumentStorage {
  load(): Block[] | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return null;
      }
      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed)) {
        return parsed as Block[];
      }
      return null;
    } catch (e) {
      console.error("Failed to load document from localStorage:", e);
      return null;
    }
  }

  save(blocks: Block[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } catch (e) {
      console.error("Failed to save document to localStorage:", e);
      throw new Error("Storage may be full or disabled");
    }
  }
}

export const documentStorage = new DocumentStorageImpl();

import type { Block } from "@blocknote/core";
import type { DocumentStorage } from "./types.js";

const STORAGE_KEY = "blocknote-document";

function isValidBlock(obj: unknown): obj is Block {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const block = obj as Record<string, unknown>;
  return (
    typeof block.id === "string" &&
    typeof block.type === "string" &&
    typeof block.props === "object" &&
    block.props !== null &&
    Array.isArray(block.children)
  );
}

function isValidBlockArray(data: unknown): data is Block[] {
  return Array.isArray(data) && data.every(isValidBlock);
}

class DocumentStorageImpl implements DocumentStorage {
  load(): Block[] | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return null;
      }
      const parsed = JSON.parse(stored) as unknown;
      if (isValidBlockArray(parsed)) {
        return parsed;
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
      throw new Error("Storage may be full or disabled", { cause: e });
    }
  }
}

export const documentStorage = new DocumentStorageImpl();

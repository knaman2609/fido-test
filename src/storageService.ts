import type { Block } from "@blocknote/core";
import type { DocumentStorage } from "./types.js";

const STORAGE_KEY = "blocknote-document";

function isValidBlock(value: unknown): value is Block {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const block = value as Record<string, unknown>;
  return (
    typeof block.id === "string" &&
    typeof block.type === "string" &&
    typeof block.props === "object" &&
    block.props !== null &&
    Array.isArray(block.content) &&
    Array.isArray(block.children)
  );
}

function isValidBlockArray(value: unknown): value is Block[] {
  return Array.isArray(value) && value.every(isValidBlock);
}

class DocumentStorageImpl implements DocumentStorage {
  load(): Block[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data === null) {
        return null;
      }
      const parsed = JSON.parse(data) as unknown;
      if (isValidBlockArray(parsed)) {
        return parsed;
      }
      console.warn("Invalid block data in localStorage");
      return null;
    } catch (error) {
      console.error("Failed to load document from localStorage:", error);
      return null;
    }
  }

  save(blocks: Block[]): void {
    try {
      const data = JSON.stringify(blocks);
      localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      if (error instanceof Error && error.name === "QuotaExceededError") {
        console.error("localStorage quota exceeded");
      } else {
        console.error("Failed to save document to localStorage:", error);
      }
      throw error;
    }
  }
}

export const documentStorage = new DocumentStorageImpl();

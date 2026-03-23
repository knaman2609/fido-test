import { PartialBlock } from '@blocknote/core';

export interface StoredDocument {
  version: number;
  content: PartialBlock[];
  lastModified: string;
}

function isValidPartialBlock(item: unknown): item is PartialBlock {
  // Permissive validation: must be a non-null object with a string 'type' property
  // PartialBlock can contain additional properties (id, children, complex inline content)
  // We intentionally do minimal validation to avoid rejecting valid BlockNote documents
  // that may have evolved with new properties in future versions
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const block = item as Record<string, unknown>;
  // Only validate that type exists and is a string - accept any other properties
  return typeof block.type === 'string';
}

function isValidPartialBlockArray(content: unknown): content is PartialBlock[] {
  if (!Array.isArray(content)) {
    return false;
  }
  return content.every(isValidPartialBlock);
}

export function loadFromLocalStorage(key: string): PartialBlock[] | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const item = window.localStorage.getItem(key);
    if (item) {
      const parsed: StoredDocument = JSON.parse(item);
      if (parsed && isValidPartialBlockArray(parsed.content)) {
        return parsed.content;
      }
    }
  } catch (error) {
    console.warn('Error loading from localStorage:', error);
  }
  return null;
}

export function saveToLocalStorage(key: string, content: PartialBlock[]) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    const data: StoredDocument = {
      version: 1,
      content,
      lastModified: new Date().toISOString(),
    };
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Error saving to localStorage:', error);
  }
}

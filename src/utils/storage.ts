import { PartialBlock } from '@blocknote/core';

export interface StoredDocument {
  version: number;
  content: PartialBlock[];
  lastModified: string;
}

export function loadFromLocalStorage(key: string): PartialBlock[] | null {
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      const parsed: StoredDocument = JSON.parse(item);
      if (parsed && Array.isArray(parsed.content)) {
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

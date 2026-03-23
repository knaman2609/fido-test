import { PartialBlock } from '@blocknote/core';

export interface StoredDocument {
  version: number;
  content: PartialBlock[];
  lastModified: string;
}

function isValidPartialBlock(item: unknown): item is PartialBlock {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const block = item as Record<string, unknown>;
  
  // Validate required 'type' property
  if (typeof block.type !== 'string' || block.type.length === 0) {
    return false;
  }
  
  // Validate optional 'props' property if present
  if (block.props !== undefined) {
    if (typeof block.props !== 'object' || block.props === null) {
      return false;
    }
  }
  
  // Validate optional 'content' property if present
  if (block.content !== undefined) {
    // Content can be string, array of inline content, or undefined
    if (typeof block.content !== 'string' && !Array.isArray(block.content)) {
      return false;
    }
  }
  
  return true;
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

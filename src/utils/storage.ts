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

const CURRENT_VERSION = 1;
const MAX_BACKUPS_PER_KEY = 5;

export function loadFromLocalStorage(key: string): PartialBlock[] | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const item = window.localStorage.getItem(key);
    if (item) {
      const parsed: StoredDocument = JSON.parse(item);
      if (parsed && parsed.version === CURRENT_VERSION && isValidPartialBlockArray(parsed.content)) {
        return parsed.content;
      }
      // Version mismatch or invalid data format - backup data before clearing
      if (parsed) {
        const backupKey = `${key}-backup-${Date.now()}`;
        try {
          window.localStorage.setItem(backupKey, item);
          // Cleanup old backups to prevent quota issues
          cleanupOldBackups(key);
        } catch (backupError) {
          console.warn('Failed to create backup for incompatible data:', backupError);
        }
      }
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('Error loading from localStorage:', error);
  }
  return null;
}

function cleanupOldBackups(key: string) {
  try {
    const backupPrefix = `${key}-backup-`;
    const backups: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const storageKey = window.localStorage.key(i);
      if (storageKey && storageKey.startsWith(backupPrefix)) {
        backups.push(storageKey);
      }
    }
    // Sort by timestamp (newest first) and remove oldest if exceeding limit
    backups.sort().reverse();
    while (backups.length > MAX_BACKUPS_PER_KEY) {
      const oldestBackup = backups.pop();
      if (oldestBackup) {
        window.localStorage.removeItem(oldestBackup);
      }
    }
  } catch (error) {
    console.warn('Error cleaning up old backups:', error);
  }
}

export function saveToLocalStorage(key: string, content: PartialBlock[]): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const data: StoredDocument = {
      version: 1,
      content,
      lastModified: new Date().toISOString(),
    };
    window.localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn('Error saving to localStorage:', error);
    return false;
  }
}

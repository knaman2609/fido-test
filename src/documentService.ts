import type { Block } from '@blocknote/core';
import type { Document, DocumentService as IDocumentService } from './types.js';

const STORAGE_KEY = 'blocknote-document';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function isValidBlock(item: unknown): item is Block {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const block = item as Record<string, unknown>;
  return (
    typeof block.id === 'string' &&
    typeof block.type === 'string' &&
    (block.props === undefined || typeof block.props === 'object') &&
    (block.content === undefined || Array.isArray(block.content) || typeof block.content === 'string')
  );
}

function isValidDocument(item: unknown): item is Document {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const doc = item as Record<string, unknown>;
  return (
    typeof doc.id === 'string' &&
    typeof doc.title === 'string' &&
    Array.isArray(doc.blocks) &&
    doc.blocks.every(isValidBlock) &&
    typeof doc.createdAt === 'number' &&
    typeof doc.updatedAt === 'number'
  );
}

class DocumentServiceImpl implements IDocumentService {
  private document: Document | null = null;

  getCurrentDocument(): Document | null {
    return this.document ? { ...this.document } : null;
  }

  load(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (isValidDocument(parsed)) {
          this.document = parsed;
        } else {
          this.createNewDocument();
        }
      } catch {
        this.createNewDocument();
      }
    } else {
      this.createNewDocument();
    }
  }

  private createNewDocument(): void {
    this.document = {
      id: generateId(),
      title: 'Untitled Document',
      blocks: [
        {
          id: generateId(),
          type: 'paragraph',
          props: { backgroundColor: 'default', textColor: 'default', textAlignment: 'left' },
          content: [
            {
              type: 'text',
              text: 'Start typing your document...',
              styles: {}
            }
          ]
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.persist();
  }

  save(blocks: Block[]): void {
    if (!this.document) {
      this.createNewDocument();
    }
    if (this.document) {
      this.document.blocks = blocks;
      this.document.updatedAt = Date.now();
      this.persist();
    }
  }

  updateTitle(title: string): void {
    if (!this.document) {
      this.createNewDocument();
    }
    if (this.document) {
      this.document.title = title;
      this.document.updatedAt = Date.now();
      this.persist();
    }
  }

  private persist(): void {
    try {
      if (this.document) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.document));
      }
    } catch {
      throw new Error('Storage may be full or disabled');
    }
  }
}

export const documentService = new DocumentServiceImpl();

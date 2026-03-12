import type { Block } from "@blocknote/core";

export function extractTextFromBlock(block: Block): string {
  if (!block.content || !Array.isArray(block.content)) {
    return "";
  }
  return block.content
    .map((c) => {
      if (typeof c !== "object" || c === null) {
        return "";
      }
      if ("text" in c) {
        return String((c as { text: string }).text);
      }
      if ("type" in c) {
        const type = (c as { type: string }).type;
        if (type === "link" && "href" in c) {
          const linkContent = (c as { content?: Array<{ text?: string }> }).content;
          if (Array.isArray(linkContent)) {
            return linkContent.map((item) => item.text || "").join("");
          }
        } else if (type === "mention" && "user" in c) {
          const mentionUser = (c as { user?: { name?: string } }).user;
          return mentionUser?.name || "";
        }
      }
      return "";
    })
    .join("");
}

export function findFirstTextBlock(
  blocks: Block[],
  predicate?: (block: Block) => boolean
): string | null {
  for (const block of blocks) {
    if (predicate && !predicate(block)) {
      continue;
    }
    const text = extractTextFromBlock(block);
    if (text.trim()) {
      return text.trim();
    }
    if (block.children && Array.isArray(block.children)) {
      const childText = findFirstTextBlock(block.children, predicate);
      if (childText) {
        return childText;
      }
    }
  }
  return null;
}

export function findFirstTextBlockPreferHeadings(blocks: Block[]): {
  text: string;
  isHeading: boolean;
} | null {
  let firstNonHeadingText: string | null = null;

  function traverse(blocksToSearch: Block[]): { text: string; isHeading: boolean } | null {
    for (const block of blocksToSearch) {
      const isHeading = block.type === "heading";
      const text = extractTextFromBlock(block);
      const trimmedText = text.trim();

      if (trimmedText) {
        if (isHeading) {
          return { text: trimmedText, isHeading: true };
        }
        if (!firstNonHeadingText) {
          firstNonHeadingText = trimmedText;
        }
      }

      if (block.children && Array.isArray(block.children)) {
        const childResult = traverse(block.children);
        if (childResult?.isHeading) {
          return childResult;
        }
      }
    }
    return null;
  }

  const headingResult = traverse(blocks);
  if (headingResult) {
    return headingResult;
  }

  if (firstNonHeadingText) {
    return { text: firstNonHeadingText, isHeading: false };
  }

  return null;
}

export interface Note {
  id: string;
  title: string;
  content: Block[];
  createdAt: number;
  updatedAt: number;
}

export type NotesCollection = Note[];

export interface NoteStorage {
  loadAllNotes(): NotesCollection;
  getNote(id: string): Note | null;
  saveNote(note: Note): void;
  createNote(): Note;
  deleteNote(id: string): boolean;
}

export interface SaveStatusElement {
  showSaved(): void;
  showError(message: string): void;
  showSaving(): void;
}

// Legacy types for migration
export type Document = Block[];
export interface DocumentStorage {
  load(): Document | null;
  save(document: Document): void;
}

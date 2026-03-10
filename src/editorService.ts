import { BlockNoteEditor } from '@blocknote/core';
import type { BlockNoteDocument } from './types.js';

export class EditorService {
  private editor: BlockNoteEditor | null = null;

  async initialize(container: HTMLElement): Promise<void> {
    this.editor = await BlockNoteEditor.create({
      parentElement: container,
      defaultStyles: true
    });
  }

  getContent(): BlockNoteDocument[] {
    return this.editor?.document || [];
  }

  clear(): void {
    if (this.editor) {
      const blocks = this.editor.document;
      if (blocks.length > 0) {
        this.editor.removeBlocks(blocks);
      }
    }
  }

  focus(): void {
    this.editor?.focus();
  }

  isEmpty(): boolean {
    const content = this.getContent();
    if (content.length === 0) return true;
    if (content.length === 1) {
      const block = content[0];
      if (block.type === 'paragraph' && (!block.content || block.content.length === 0)) {
        return true;
      }
    }
    return false;
  }

  destroy(): void {
    this.editor = null;
  }
}

export const editorService = new EditorService();

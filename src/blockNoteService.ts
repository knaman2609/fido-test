import { BlockNoteEditor } from '@blocknote/core';

// Simplified Block type for our use case
interface Block {
  id?: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: Block[];
}

class BlockNoteService {
  createEditor(
    container: HTMLElement,
    initialContent?: Block[]
  ): BlockNoteEditor {
    const editor = BlockNoteEditor.create({
      initialContent: initialContent ?? [
        {
          type: 'paragraph',
          content: '',
        },
      ],
    });

    return editor;
  }

  serializeContent(blocks: Block[]): string {
    return JSON.stringify(blocks);
  }

  deserializeContent(json: string): Block[] {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        return parsed as Block[];
      }
    } catch {
      // Fallback to empty paragraph if deserialization fails
    }
    return [
      {
        type: 'paragraph',
        content: '',
      },
    ];
  }

  async blocksToHTML(blocks: Block[]): Promise<string> {
    const editor = BlockNoteEditor.create({ initialContent: blocks });
    const html = await editor.blocksToHTMLLossy(blocks);
    return html;
  }

  extractPlainText(blocks: Block[]): string {
    return blocks
      .map((block: Block) => {
        if (!block.content) return '';
        if (typeof block.content === 'string') {
          return block.content;
        }
        if (Array.isArray(block.content)) {
          return block.content
            .map((c: Block) => {
              if (typeof c === 'string') return c;
              if (c && typeof c === 'object' && 'text' in c) {
                return String(c.text || '');
              }
              return '';
            })
            .join('');
        }
        return '';
      })
      .join(' ')
      .trim();
  }

  isEmptyContent(blocks: Block[]): boolean {
    const text = this.extractPlainText(blocks);
    return text.length === 0;
  }

  createSingleParagraphBlock(text: string): Block[] {
    return [
      {
        type: 'paragraph',
        content: text,
      },
    ];
  }
}

export const blockNoteService = new BlockNoteService();

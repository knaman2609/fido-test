import type { BlockNoteDocument, BlockNoteBlock, BlockNoteService as IBlockNoteService } from './types.js';

class BlockNoteServiceImpl implements IBlockNoteService {
  createEmptyDocument(): BlockNoteDocument {
    return [
      {
        type: 'paragraph',
        content: []
      }
    ];
  }

  isValidDocument(document: unknown): document is BlockNoteDocument {
    if (!Array.isArray(document)) {
      return false;
    }

    if (document.length === 0) {
      return false;
    }

    return document.every(block => this.isValidBlock(block));
  }

  private isValidBlock(block: unknown): block is BlockNoteBlock {
    if (typeof block !== 'object' || block === null) {
      return false;
    }

    const b = block as Record<string, unknown>;

    if (typeof b.type !== 'string') {
      return false;
    }

    if (b.props !== undefined && typeof b.props !== 'object') {
      return false;
    }

    if (b.content !== undefined && !Array.isArray(b.content)) {
      return false;
    }

    if (b.children !== undefined && !Array.isArray(b.children)) {
      return false;
    }

    return true;
  }

  documentToHTML(document: BlockNoteDocument): string {
    if (!document || document.length === 0) {
      return '<p></p>';
    }

    return document.map(block => this.blockToHTML(block)).join('');
  }

  private blockToHTML(block: BlockNoteBlock): string {
    const content = this.inlineContentToHTML(block.content);

    switch (block.type) {
      case 'paragraph':
        return `<p>${content}</p>`;
      case 'heading': {
        const level = (block.props?.level as number) || 1;
        const validLevel = Math.min(Math.max(level, 1), 6);
        return `<h${validLevel}>${content}</h${validLevel}>`;
      }
      case 'bulletListItem':
        return `<li class="bn-bullet-item">${content}</li>`;
      case 'numberedListItem':
        return `<li class="bn-numbered-item">${content}</li>`;
      case 'checkListItem': {
        const checked = block.props?.checked ? 'checked' : '';
        return `<div class="bn-check-item"><input type="checkbox" ${checked} disabled> ${content}</div>`;
      }
      case 'image': {
        const src = (block.props?.src as string) || '';
        const alt = (block.props?.alt as string) || '';
        if (!this.isValidImageUrl(src)) {
          return '';
        }
        return `<img src="${this.escapeHtml(src)}" alt="${this.escapeHtml(alt)}" class="bn-image">`;
      }
      default:
        return `<p>${content}</p>`;
    }
  }

  private inlineContentToHTML(content: BlockNoteBlock['content']): string {
    if (!content || content.length === 0) {
      return '';
    }

    return content.map(item => {
      let text = this.escapeHtml(item.text);

      if (item.styles) {
        item.styles.forEach(style => {
          switch (style.type) {
            case 'bold':
              text = `<strong>${text}</strong>`;
              break;
            case 'italic':
              text = `<em>${text}</em>`;
              break;
            case 'underline':
              text = `<u>${text}</u>`;
              break;
            case 'strike':
              text = `<s>${text}</s>`;
              break;
            case 'code':
              text = `<code>${text}</code>`;
              break;
          }
        });
      }

      return text;
    }).join('');
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  extractPlainText(document: BlockNoteDocument): string {
    if (!document || document.length === 0) {
      return '';
    }

    return document.map(block => this.extractTextFromBlock(block)).join(' ').trim();
  }

  private extractTextFromBlock(block: BlockNoteBlock): string {
    if (!block.content || block.content.length === 0) {
      return '';
    }

    return block.content.map(item => item.text).join('');
  }
}

export const blocknoteService = new BlockNoteServiceImpl();

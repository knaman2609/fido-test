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

    return this.processBlocksWithLists(document);
  }

  private processBlocksWithLists(blocks: BlockNoteDocument): string {
    const result: string[] = [];
    let currentListType: 'bullet' | 'numbered' | null = null;
    const currentListItems: string[] = [];

    const flushList = (): void => {
      if (currentListItems.length === 0) {
        return;
      }
      const tag = currentListType === 'bullet' ? 'ul' : 'ol';
      result.push(`<${tag} class="bn-${currentListType}-list">${currentListItems.join('')}</${tag}>`);
      currentListItems.length = 0;
      currentListType = null;
    };

    for (const block of blocks) {
      if (block.type === 'bulletListItem') {
        if (currentListType !== null && currentListType !== 'bullet') {
          flushList();
        }
        currentListType = 'bullet';
        currentListItems.push(this.blockToHTML(block));
      } else if (block.type === 'numberedListItem') {
        if (currentListType !== null && currentListType !== 'numbered') {
          flushList();
        }
        currentListType = 'numbered';
        currentListItems.push(this.blockToHTML(block));
      } else {
        flushList();
        result.push(this.blockToHTML(block));
      }
    }

    flushList();
    return result.join('');
  }

  private blockToHTML(block: BlockNoteBlock): string {
    const content = this.inlineContentToHTML(block.content);
    const childrenHTML = block.children && block.children.length > 0
      ? this.processBlocksWithLists(block.children)
      : '';

    switch (block.type) {
      case 'paragraph':
        return `<p>${content}${childrenHTML}</p>`;
      case 'heading': {
        const level = (block.props?.level as number) || 1;
        const validLevel = Math.min(Math.max(level, 1), 6);
        return `<h${validLevel}>${content}${childrenHTML}</h${validLevel}>`;
      }
      case 'bulletListItem':
        return `<li class="bn-bullet-item">${content}${childrenHTML}</li>`;
      case 'numberedListItem':
        return `<li class="bn-numbered-item">${content}${childrenHTML}</li>`;
      case 'checkListItem': {
        const checked = block.props?.checked ? 'checked' : '';
        return `<div class="bn-check-item"><input type="checkbox" ${checked} disabled> ${content}${childrenHTML}</div>`;
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
        return `<p>${content}${childrenHTML}</p>`;
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

  private isValidImageUrl(url: string): boolean {
    if (!url) {
      return false;
    }
    try {
      const parsed = new URL(url, window.location.href);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  extractPlainText(document: BlockNoteDocument): string {
    if (!document || document.length === 0) {
      return '';
    }

    return document.map(block => this.extractTextFromBlock(block)).join(' ').trim();
  }

  private extractTextFromBlock(block: BlockNoteBlock): string {
    const texts: string[] = [];

    if (block.content && block.content.length > 0) {
      texts.push(block.content.map(item => item.text).join(''));
    }

    if (block.children && block.children.length > 0) {
      texts.push(...block.children.map(child => this.extractTextFromBlock(child)));
    }

    return texts.join(' ');
  }
}

export const blocknoteService = new BlockNoteServiceImpl();

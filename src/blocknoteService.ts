import { BlockNoteEditor, type Block } from '@blocknote/core';
import type { BlockNoteDocument } from './types.js';

let editorInstance: BlockNoteEditor | null = null;

export async function initializeEditor(container: HTMLElement): Promise<BlockNoteEditor> {
  if (editorInstance) {
    return editorInstance;
  }

  editorInstance = await BlockNoteEditor.create({
    parentElement: container,
    defaultStyles: true,
    initialContent: createEmptyDocument()
  });

  return editorInstance;
}

export function getContent(editor: BlockNoteEditor): BlockNoteDocument {
  return editor.document;
}

export function setContent(editor: BlockNoteEditor, content: BlockNoteDocument): void {
  editor.replaceBlocks(editor.document, content);
}

export function createEmptyDocument(): BlockNoteDocument {
  return [
    {
      id: 'initial-block',
      type: 'paragraph',
      props: {
        backgroundColor: 'default',
        textColor: 'default',
        textAlignment: 'left'
      },
      content: [],
      children: []
    }
  ];
}

export function isEmptyContent(content: BlockNoteDocument): boolean {
  if (!content || content.length === 0) return true;
  
  return content.every(block => {
    if (block.type !== 'paragraph') return false;
    if (!block.content || block.content.length === 0) return true;
    return block.content.every((inline) => {
      if (typeof inline === 'object' && inline !== null && 'text' in inline) {
        const textInline = inline as { text?: string };
        return !textInline.text || textInline.text === '';
      }
      return true;
    });
  });
}

export function blocksToHTML(blocks: BlockNoteDocument): string {
  return blocks.map(block => blockToHTML(block)).join('');
}

function blockToHTML(block: Block): string {
  const content = inlineContentToHTML(block.content);
  const children = block.children ? blocksToHTML(block.children) : '';

  switch (block.type) {
    case 'paragraph':
      return `<p>${content}${children}</p>`;
    case 'heading': {
      const level = (block.props?.level as number) || 1;
      const tag = `h${Math.min(Math.max(level, 1), 6)}`;
      return `<${tag}>${content}${children}</${tag}>`;
    }
    case 'bulletListItem':
      return `<ul><li>${content}${children}</li></ul>`;
    case 'numberedListItem':
      return `<ol><li>${content}${children}</li></ol>`;
    case 'checkListItem': {
      const checked = block.props?.checked ? 'checked' : '';
      return `<div class="checklist-item"><input type="checkbox" ${checked} disabled><span>${content}${children}</span></div>`;
    }
    case 'quote':
      return `<blockquote>${content}${children}</blockquote>`;
    case 'codeBlock':
      return `<pre><code>${content}${children}</code></pre>`;
    default:
      return `<p>${content}${children}</p>`;
  }
}

function inlineContentToHTML(content: unknown): string {
  if (!content || !Array.isArray(content)) return '';

  return content.map((item) => {
    if (typeof item === 'object' && item !== null) {
      const inline = item as { type?: string; text?: string; styles?: Record<string, boolean>; href?: string };
      
      if (inline.type === 'link' && inline.href) {
        const text = escapeHTML(inline.text || inline.href);
        return `<a href="${escapeHTML(inline.href)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
      
      if (inline.text) {
        let text = escapeHTML(inline.text);
        const styles = inline.styles || {};
        
        if (styles.bold) text = `<strong>${text}</strong>`;
        if (styles.italic) text = `<em>${text}</em>`;
        if (styles.underline) text = `<u>${text}</u>`;
        if (styles.strike) text = `<s>${text}</s>`;
        if (styles.code) text = `<code>${text}</code>`;
        
        return text;
      }
    }
    return '';
  }).join('');
}

function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function extractPlainText(content: BlockNoteDocument): string {
  if (!content || content.length === 0) return '';
  
  return content.map(block => {
    let text = '';
    if (block.content && Array.isArray(block.content)) {
      text = block.content
        .map((item) => {
          if (typeof item === 'object' && item !== null) {
            const inline = item as { type?: string; text?: string; href?: string };
            if (inline.type === 'link' && inline.href) {
              return inline.text || inline.href;
            }
            return inline.text || '';
          }
          return '';
        })
        .join('');
    }
    const childrenText = block.children ? extractPlainText(block.children) : '';
    return text + childrenText;
  }).join(' ').trim();
}

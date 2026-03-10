import type { BlockNoteDocument } from './types.js';

interface InlineContent {
  type: string;
  text?: string;
  styles?: Record<string, unknown>;
}

interface Block {
  type: string;
  props?: Record<string, unknown>;
  content?: InlineContent[];
  children?: Block[];
}

export function isEmptyContent(content: BlockNoteDocument[]): boolean {
  if (content.length === 0) return true;
  if (content.length === 1) {
    const block = content[0] as Block;
    if (block.type === 'paragraph' && (!block.content || block.content.length === 0)) {
      return true;
    }
  }
  return false;
}

export function getPlainTextPreview(content: BlockNoteDocument[]): string {
  const texts: string[] = [];
  
  for (const doc of content) {
    const block = doc as Block;
    if (block.content) {
      for (const inline of block.content) {
        if (inline.text) {
          texts.push(inline.text);
        }
      }
    }
  }
  
  return texts.join(' ').trim();
}

export function convertToHtml(content: BlockNoteDocument[]): string {
  const blocks: string[] = [];
  
  for (const doc of content) {
    const html = blockToHtml(doc as Block);
    if (html) {
      blocks.push(html);
    }
  }
  
  return blocks.join('');
}

function blockToHtml(block: Block): string {
  const content = inlineContentToHtml(block.content || []);
  
  switch (block.type) {
    case 'paragraph':
      return `<p>${content}</p>`;
    case 'heading':
      const level = (block.props?.level as number) || 1;
      return `<h${level}>${content}</h${level}>`;
    case 'bulletListItem':
      return `<li style="list-style-type: disc; margin-left: 20px;">${content}</li>`;
    case 'numberedListItem':
      return `<li style="list-style-type: decimal; margin-left: 20px;">${content}</li>`;
    case 'checkListItem':
      const checked = block.props?.checked ? 'checked' : '';
      return `<div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;"><input type="checkbox" disabled ${checked}><span>${content}</span></div>`;
    case 'codeBlock':
      return `<pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto;"><code>${content}</code></pre>`;
    case 'blockquote':
      return `<blockquote style="border-left: 3px solid #ccc; padding-left: 12px; margin: 8px 0; color: #666;">${content}</blockquote>`;
    default:
      return `<p>${content}</p>`;
  }
}

function inlineContentToHtml(content: InlineContent[]): string {
  if (!content || content.length === 0) return '';
  
  return content.map(inline => {
    let text = escapeHtml(inline.text || '');
    const styles = inline.styles || {};
    
    if (styles.bold) text = `<strong>${text}</strong>`;
    if (styles.italic) text = `<em>${text}</em>`;
    if (styles.underline) text = `<u>${text}</u>`;
    if (styles.strikethrough) text = `<s>${text}</s>`;
    if (styles.code) text = `<code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px; font-family: monospace;">${text}</code>`;
    
    return text;
  }).join('');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

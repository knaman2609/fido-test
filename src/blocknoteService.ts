import type { BlockNoteJSON, BlockNoteBlock } from './types.js';

export function createEmptyBlock(): BlockNoteJSON {
  return [
    {
      type: 'paragraph',
      content: []
    }
  ];
}

export function createBlockFromText(text: string): BlockNoteJSON {
  return [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: text
        }
      ]
    }
  ];
}

export function isEmptyContent(content: BlockNoteJSON | undefined): boolean {
  if (!content || content.length === 0) {
    return true;
  }

  return content.every(block => {
    if (block.type !== 'paragraph') {
      return false;
    }
    if (!block.content || block.content.length === 0) {
      return true;
    }
    const text = block.content
      .map(c => c.text || '')
      .join('')
      .trim();
    return text === '';
  });
}

export function extractPlainText(content: BlockNoteJSON | undefined): string {
  if (!content) {
    return '';
  }

  const texts: string[] = [];

  function extractFromBlock(block: BlockNoteBlock): void {
    if (block.content) {
      const blockText = block.content
        .map(c => c.text || '')
        .join('');
      if (blockText) {
        texts.push(blockText);
      }
    }

    if (block.children) {
      block.children.forEach(extractFromBlock);
    }
  }

  content.forEach(extractFromBlock);
  return texts.join(' ');
}

export function convertBlocksToHtml(content: BlockNoteJSON | undefined): string {
  if (!content || content.length === 0) {
    return '';
  }

  const htmlParts: string[] = [];

  function convertBlock(block: BlockNoteBlock): string {
    const contentText = (block.content || [])
      .map(c => {
        let text = escapeHtml(c.text || '');
        if (c.styles) {
          c.styles.forEach(style => {
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
      })
      .join('');

    const childrenHtml = (block.children || [])
      .map(convertBlock)
      .join('');

    switch (block.type) {
      case 'paragraph':
        return `<p>${contentText}${childrenHtml}</p>`;
      case 'heading':
        const level = (block.props?.level as number) || 1;
        return `<h${level}>${contentText}</h${level}>`;
      case 'bulletListItem':
        return `<li>${contentText}${childrenHtml}</li>`;
      case 'numberedListItem':
        return `<li>${contentText}${childrenHtml}</li>`;
      case 'checkListItem':
        const checked = block.props?.checked ? 'checked' : '';
        return `<div class="check-item"><input type="checkbox" ${checked} disabled> ${contentText}</div>`;
      case 'codeBlock':
        return `<pre><code>${contentText}</code></pre>`;
      case 'quote':
        return `<blockquote>${contentText}</blockquote>`;
      case 'image':
        const src = block.props?.url as string || '';
        const alt = block.props?.caption as string || '';
        return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="todo-inline-image">`;
      default:
        return `<div>${contentText}${childrenHtml}</div>`;
    }
  }

  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  content.forEach((block, index) => {
    const isListItem = block.type === 'bulletListItem' || block.type === 'numberedListItem';
    const currentListType = block.type === 'bulletListItem' ? 'ul' : block.type === 'numberedListItem' ? 'ol' : null;

    if (isListItem) {
      if (!inList || listType !== currentListType) {
        if (inList) {
          htmlParts.push(`</${listType}>`);
        }
        htmlParts.push(`<${currentListType}>`);
        inList = true;
        listType = currentListType;
      }
      htmlParts.push(convertBlock(block));
    } else {
      if (inList) {
        htmlParts.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      htmlParts.push(convertBlock(block));
    }
  });

  if (inList) {
    htmlParts.push(`</${listType}>`);
  }

  return htmlParts.join('');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function migrateTodoTextToContent(text: string | undefined): BlockNoteJSON | undefined {
  if (!text) {
    return undefined;
  }
  return createBlockFromText(text);
}

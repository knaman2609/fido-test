import { $node, $view, $ctx } from '@milkdown/utils';
import type { Node } from '@milkdown/prose/model';
import type { NodeViewConstructor } from '@milkdown/prose/view';
import { createRoot, type Root } from 'react-dom/client';
import React from 'react';
import { DiffBlock } from '../components/DiffBlock';

export const diffModeCtx = $ctx<boolean, 'diffMode'>(true, 'diffMode');

export const diffBlockSchema = $node('diffBlock', () => ({
  content: 'text*',
  group: 'block',
  marks: '',
  defining: true,
  code: true,
  attrs: {
    language: { default: 'diff' },
  },
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: 'full',
      getAttrs: (dom) => {
        const element = dom as HTMLElement;
        const code = element.querySelector('code');
        const language = code?.getAttribute('class')?.replace('language-', '') || 'diff';
        return language === 'diff' ? { language } : false;
      },
    },
  ],
  toDOM: (node) => {
    return [
      'pre',
      { 'data-language': node.attrs.language },
      ['code', { class: `language-${node.attrs.language}` }, 0],
    ];
  },
  parseMarkdown: {
    match: ({ type, lang }) => {
      return type === 'code' && lang === 'diff';
    },
    runner: (state, node, type) => {
      const value = node.value as string;
      state.openNode(type, { language: 'diff' });
      state.addText(value);
      state.closeNode();
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === 'diffBlock',
    runner: (state, node) => {
      const text = node.textContent;
      state.addNode('code', undefined, text, { lang: 'diff' });
    },
  },
}));

class DiffBlockView {
  dom: HTMLElement;
  root: Root;
  content: string;

  constructor(node: Node) {
    this.dom = document.createElement('div');
    this.dom.className = 'milkdown-diff-block';
    this.content = node.textContent;
    this.root = createRoot(this.dom);
    this.render();
  }

  render() {
    const element = React.createElement(DiffBlock, { content: this.content });
    this.root.render(element);
  }

  update(node: Node) {
    if (node.type.name !== 'diffBlock') return false;
    const newContent = node.textContent;
    if (newContent !== this.content) {
      this.content = newContent;
      this.render();
    }
    return true;
  }

  destroy() {
    this.root.unmount();
  }
}

export const diffBlockView = $view(diffBlockSchema, () => {
  const nodeView: NodeViewConstructor = (node) => {
    return new DiffBlockView(node);
  };
  return nodeView;
});

export const diffPlugin = [diffBlockSchema, diffBlockView];

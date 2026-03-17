import { $node, $view } from '@milkdown/utils';
import { Node } from '@milkdown/prose/model';
import { createRoot } from 'react-dom/client';
import { DiffBlock } from '../components/DiffBlock';

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

export const diffBlockView = $view(diffBlockSchema, (ctx) => {
  return (node: Node, view, getPos) => {
    const dom = document.createElement('div');
    dom.className = 'milkdown-diff-block';

    const content = node.textContent;

    const root = createRoot(dom);
    root.render(DiffBlock({ content }));

    return {
      dom,
      update: (updatedNode: Node) => {
        if (updatedNode.type.name !== 'diffBlock') return false;
        const newContent = updatedNode.textContent;
        root.render(DiffBlock({ content: newContent }));
        return true;
      },
      destroy: () => {
        root.unmount();
      },
    };
  };
});

export const diffPlugin = [diffBlockSchema, diffBlockView];

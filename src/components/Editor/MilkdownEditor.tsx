import React, { useEffect, useRef } from 'react';
import { Milkdown, useEditor } from '@milkdown/react';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { nord } from '@milkdown/theme-nord';
import { history } from '@milkdown/plugin-history';
import { listener, listenerCtx } from '@milkdown/plugin-listener';

interface MilkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const MilkdownEditor: React.FC<MilkdownEditorProps> = ({
  content,
  onChange,
}) => {
  const onChangeRef = useRef(onChange);
  const contentRef = useRef(content);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, contentRef.current);
        ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            onChangeRef.current(markdown);
          }
        });
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listener);
  }, []);

  return <Milkdown />;
};

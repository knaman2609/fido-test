import React, { useEffect, useRef } from 'react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { nord } from '@milkdown/theme-nord';
import { history } from '@milkdown/plugin-history';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { MilkdownProvider, Milkdown, useEditor } from '@milkdown/react';
import { diffPlugin, diffModeCtx } from './plugins/diffPlugin';

interface MilkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  isDiffMode: boolean;
}

const MilkdownEditorInner: React.FC<MilkdownEditorProps> = ({
  content,
  onChange,
  isDiffMode,
}) => {
  const onChangeRef = useRef(onChange);
  const contentRef = useRef(content);
  const isDiffModeRef = useRef(isDiffMode);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    isDiffModeRef.current = isDiffMode;
  }, [isDiffMode]);

  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, contentRef.current);
        ctx.set(diffModeSlice, isDiffModeRef.current);
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
      .use(listener)
      .use(diffPlugin);
  }, []);

  return <Milkdown />;
};

export const MilkdownEditor: React.FC<MilkdownEditorProps> = (props) => {
  return (
    <MilkdownProvider>
      <MilkdownEditorInner {...props} />
    </MilkdownProvider>
  );
};
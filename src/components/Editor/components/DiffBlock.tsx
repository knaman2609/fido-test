import React, { useMemo } from 'react';
import { FileDiff, parseDiffFromFile, type FileDiffMetadata } from '@pierre/diffs/react';
import { useThemeStore } from '../../../store/themeStore';

interface DiffBlockProps {
  content: string;
}

export const DiffBlock: React.FC<DiffBlockProps> = ({ content }) => {
  const { theme } = useThemeStore();

  const fileDiff: FileDiffMetadata | null = useMemo(() => {
    const lines = content.split('\n');
    const oldLines: string[] = [];
    const newLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('+')) {
        newLines.push(line.slice(1));
        oldLines.push('');
      } else if (line.startsWith('-')) {
        oldLines.push(line.slice(1));
        newLines.push('');
      } else if (line.startsWith(' ')) {
        oldLines.push(line.slice(1));
        newLines.push(line.slice(1));
      } else {
        oldLines.push(line);
        newLines.push(line);
      }
    }

    const oldContent = oldLines.join('\n');
    const newContent = newLines.join('\n');

    try {
      return parseDiffFromFile(
        { name: 'old.txt', contents: oldContent },
        { name: 'new.txt', contents: newContent }
      );
    } catch {
      return null;
    }
  }, [content]);

  if (!fileDiff) {
    return (
      <pre className="diff-block-error">
        <code>{content}</code>
      </pre>
    );
  }

  return (
    <div className="diff-block" data-theme={theme}>
      <FileDiff
        fileDiff={fileDiff}
        options={{
          themeType: theme === 'dark' ? 'dark' : 'light',
        }}
      />
    </div>
  );
};

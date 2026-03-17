import React from 'react';
import { FileDiff } from '@pierre/diffs/react';
import { useThemeStore } from '../../../store/themeStore';

interface DiffBlockProps {
  content: string;
}

export const DiffBlock: React.FC<DiffBlockProps> = ({ content }) => {
  const { theme } = useThemeStore();

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

  return (
    <div className="diff-block" data-theme={theme}>
      <FileDiff
        oldContent={oldContent}
        newContent={newContent}
        filename="diff"
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
};

import type { FC } from 'react';
import type { Note } from '../types/note';
import { formatFullDate, getWordCount } from '../utils/storage';

interface NoteMetadataProps {
  note: Note;
}

export const NoteMetadata: FC<NoteMetadataProps> = ({ note }) => {
  const wordCount = getWordCount(note.content);

  return (
    <div className="note-metadata">
      <div className="metadata-row">
        <span className="metadata-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Created {formatFullDate(note.createdAt)}
        </span>
      </div>
      <div className="metadata-row">
        <span className="metadata-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edited {formatFullDate(note.updatedAt)}
        </span>
      </div>
      {wordCount > 0 && (
        <div className="metadata-row">
          <span className="metadata-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
        </div>
      )}
    </div>
  );
};

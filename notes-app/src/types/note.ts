export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type NoteSummary = Pick<Note, 'id' | 'title' | 'updatedAt'>;

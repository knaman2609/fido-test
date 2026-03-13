export interface BlockNoteBlock {
  id: string;
  type: string;
  props: Record<string, unknown>;
  content: Array<{ type: string; text: string; styles?: Record<string, unknown> }> | string;
  children: BlockNoteBlock[];
}

export interface Note {
  id: string;
  title: string;
  preview: string;
  content: BlockNoteBlock[];
  createdAt: number;
  updatedAt: number;
}

export interface StorageData {
  notes: Note[];
  lastSelectedNoteId?: string;
}

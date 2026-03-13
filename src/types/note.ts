export interface BlockContent {
  type: string;
  props?: Record<string, unknown>;
  content?: string | Array<{ type: string; text: string }>;
  children?: BlockContent[];
  [key: string]: unknown;
}

export interface Note {
  id: string;
  title: string;
  preview: string;
  content: BlockContent[];
  createdAt: number;
  updatedAt: number;
}

export interface StorageData {
  notes: Note[];
  lastSelectedNoteId?: string;
}

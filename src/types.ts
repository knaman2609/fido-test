// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockData = any;

export interface Document {
  id: string;
  title: string;
  blocks: BlockData[];
  createdAt: number;
  updatedAt: number;
}

export interface DocumentService {
  getCurrentDocument(): Document | null;
  load(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(blocks: any[]): void;
  updateTitle(title: string): void;
}

export interface DOMElements {
  editorContainer: HTMLDivElement;
  errorMessage: HTMLDivElement;
}

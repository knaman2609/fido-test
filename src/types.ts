import type { Block } from "@blocknote/core";

export interface DocumentStorage {
  load(): Block[] | null;
  save(blocks: Block[]): void;
}

import { BlockNoteEditor, type Block } from "@blocknote/core";
import { documentStorage } from "./storageService.js";

const SAVE_DEBOUNCE_MS = 500;

class SaveStatus {
  private element: HTMLElement;
  private clearTimeoutId: number | null = null;

  constructor(elementId: string) {
    const element = document.getElementById(elementId);
    if (element === null) {
      throw new Error(`Element with id '${elementId}' not found`);
    }
    this.element = element;
  }

  showSaving(): void {
    this.clearAutoClear();
    this.element.textContent = "Saving...";
    this.element.className = "save-status saving";
  }

  showSaved(): void {
    this.clearAutoClear();
    this.element.textContent = "Saved";
    this.element.className = "save-status saved";
    this.clearTimeoutId = window.setTimeout(() => {
      this.showReady();
    }, 2000);
  }

  showError(message: string): void {
    this.clearAutoClear();
    this.element.textContent = `Error: ${message}`;
    this.element.className = "save-status error";
  }

  showReady(): void {
    this.clearAutoClear();
    this.element.textContent = "Ready";
    this.element.className = "save-status";
  }

  private clearAutoClear(): void {
    if (this.clearTimeoutId !== null) {
      clearTimeout(this.clearTimeoutId);
      this.clearTimeoutId = null;
    }
  }
}

function getDefaultContent(): Block[] {
  return [
    {
      id: "default",
      type: "paragraph",
      props: {
        backgroundColor: "default",
        textColor: "default",
        textAlignment: "left",
      },
      content: [],
      children: [],
    },
  ];
}

async function init(): Promise<void> {
  const editorContainer = document.getElementById("editor");
  if (editorContainer === null) {
    throw new Error("Editor container not found");
  }

  const saveStatus = new SaveStatus("save-status");

  const initialContent = documentStorage.load() ?? getDefaultContent();

  const editor = await BlockNoteEditor.create({ initialContent });
  editor.mount(editorContainer);

  let saveTimeoutId: number | null = null;
  let pendingBlocks: Block[] | null = null;

  function flushSave(): void {
    if (saveTimeoutId !== null && pendingBlocks !== null) {
      clearTimeout(saveTimeoutId);
      saveTimeoutId = null;
      try {
        documentStorage.save(pendingBlocks);
      } catch (error) {
        console.error("Failed to save on unload:", error);
      }
      pendingBlocks = null;
    }
  }

  function handleSave(blocks: Block[]): void {
    if (saveTimeoutId !== null) {
      clearTimeout(saveTimeoutId);
    }

    pendingBlocks = blocks;
    saveStatus.showSaving();

    saveTimeoutId = window.setTimeout(() => {
      try {
        documentStorage.save(blocks);
        saveStatus.showSaved();
        pendingBlocks = null;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        saveStatus.showError(message);
      }
    }, SAVE_DEBOUNCE_MS);
  }

  editor.onChange(() => {
    const blocks = editor.document;
    handleSave(blocks);
  });

  window.addEventListener("beforeunload", () => {
    flushSave();
  });
}

function handleInitError(error: unknown): void {
  console.error("Failed to initialize editor:", error);
  const saveStatus = document.getElementById("save-status");
  if (saveStatus !== null) {
    saveStatus.textContent = "Error: Failed to initialize editor";
    saveStatus.className = "save-status error";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init().catch(handleInitError);
  });
} else {
  init().catch(handleInitError);
}

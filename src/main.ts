import { BlockNoteEditor } from "@blocknote/core";
import { documentStorage } from "./storageService.js";
import type { Block } from "@blocknote/core";

const SAVE_DEBOUNCE_MS = 500;

class SaveStatus {
  private element: HTMLElement;
  private timeoutId: number | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  showSaving(): void {
    this.element.textContent = "Saving...";
    this.element.className = "save-status";
  }

  showSaved(): void {
    this.element.textContent = "Saved";
    this.element.className = "save-status saved";
    this.clearAfterDelay();
  }

  showError(message: string): void {
    this.element.textContent = message;
    this.element.className = "save-status error";
    this.clearAfterDelay();
  }

  private clearAfterDelay(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => {
      this.element.textContent = "Ready";
      this.element.className = "save-status";
    }, 3000);
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

function init(): void {
  const editorContainer = document.getElementById("editor");
  const saveStatusElement = document.getElementById("saveStatus");

  if (!editorContainer || !saveStatusElement) {
    throw new Error("Required DOM elements not found");
  }

  const saveStatus = new SaveStatus(saveStatusElement);
  const initialContent = documentStorage.load() ?? getDefaultContent();

  const editor = BlockNoteEditor.create({
    initialContent,
  });

  editor.mount(editorContainer);

  let saveTimeoutId: number | null = null;

  function handleSave(blocks: Block[]): void {
    if (saveTimeoutId !== null) {
      clearTimeout(saveTimeoutId);
    }

    saveStatus.showSaving();

    saveTimeoutId = window.setTimeout(() => {
      try {
        documentStorage.save(blocks);
        saveStatus.showSaved();
      } catch {
        saveStatus.showError("Failed to save");
      }
    }, SAVE_DEBOUNCE_MS);
  }

  editor.onChange(() => {
    const blocks = editor.document;
    handleSave(blocks);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void init());
} else {
  void init();
}

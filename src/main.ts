import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
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
      type: "paragraph",
      content: "",
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  new BlockNoteView(editor, editorContainer);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  void init();
}

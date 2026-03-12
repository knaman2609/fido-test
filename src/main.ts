import { BlockNoteEditor, defaultBlockSpecs, getDefaultSlashMenuItems } from "@blocknote/core";
import { noteStorage } from "./storageService.js";
import type { Block } from "@blocknote/core";
import type { Note, NotesCollection } from "./types.js";
import { findFirstTextBlock } from "./types.js";

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

class NoteSidebar {
  private container: HTMLElement;
  private activeNoteId: string | null = null;
  private onSelectNote: (id: string) => void;

  constructor(
    container: HTMLElement,
    onSelectNote: (id: string) => void
  ) {
    this.container = container;
    this.onSelectNote = onSelectNote;
  }

  renderNotesList(notes: NotesCollection): void {
    this.container.innerHTML = "";

    if (notes.length === 0) {
      this.renderEmptyState();
      return;
    }

    notes.forEach((note) => {
      const noteElement = this.createNoteElement(note);
      this.container.appendChild(noteElement);
    });
  }

  private renderEmptyState(): void {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "No notes yet. Create your first note!";
    this.container.appendChild(emptyState);
  }

  private createNoteElement(note: Note): HTMLElement {
    const element = document.createElement("div");
    element.className = "note-item";
    element.dataset.noteId = note.id;

    if (note.id === this.activeNoteId) {
      element.classList.add("active");
    }

    const title = document.createElement("div");
    title.className = "note-title";
    title.textContent = note.title || "Untitled Note";

    const preview = document.createElement("div");
    preview.className = "note-preview";
    preview.textContent = this.extractPreview(note.content);

    const date = document.createElement("div");
    date.className = "note-date";
    date.textContent = this.formatDate(note.updatedAt);

    element.appendChild(title);
    element.appendChild(preview);
    element.appendChild(date);

    element.addEventListener("click", () => {
      this.onSelectNote(note.id);
    });

    return element;
  }

  private extractPreview(blocks: Block[]): string {
    const text = findFirstTextBlock(blocks);
    if (text) {
      return text.slice(0, 60) + (text.length > 60 ? "..." : "");
    }
    return "No additional text";
  }

  private formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  }

  setActiveNote(id: string | null): void {
    this.activeNoteId = id;

    const items = this.container.querySelectorAll(".note-item");
    items.forEach((item) => {
      item.classList.remove("active");
      const noteId = item.getAttribute("data-note-id");
      if (id && noteId === id) {
        item.classList.add("active");
      }
    });
  }

  refreshNote(note: Note): void {
    const existingItem = this.container.querySelector(
      `[data-note-id="${note.id}"]`
    );
    if (existingItem) {
      const newItem = this.createNoteElement(note);
      if (existingItem.classList.contains("active")) {
        newItem.classList.add("active");
      }
      existingItem.replaceWith(newItem);
    }
  }
}

class NoteManager {
  private notes: NotesCollection = [];
  private activeNoteId: string | null = null;
  private editor: BlockNoteEditor | null = null;
  private sidebar: NoteSidebar;
  private saveStatus: SaveStatus;
  private saveTimeoutId: number | null = null;

  constructor(
    sidebar: NoteSidebar,
    saveStatus: SaveStatus
  ) {
    this.sidebar = sidebar;
    this.saveStatus = saveStatus;
  }

  initialize(): Block[] | undefined {
    this.notes = noteStorage.loadAllNotes();

    if (this.notes.length === 0) {
      const defaultNote = noteStorage.createNote();
      this.notes = [defaultNote];
    }

    this.sidebar.renderNotesList(this.notes);
    return this.notes[0]?.content;
  }

  selectNote(id: string): void {
    const note = noteStorage.getNote(id);
    if (!note) {
      // eslint-disable-next-line no-console
      console.error(`Note with id "${id}" not found`);
      this.saveStatus.showError("Note not found");
      return;
    }

    this.activeNoteId = id;
    this.sidebar.setActiveNote(id);

    if (this.editor) {
      const currentBlocks = this.editor.document;
      const blockIds = currentBlocks.map((block) => block.id);
      this.editor.replaceBlocks(blockIds, note.content);
    }
  }

  createNewNote(): void {
    const newNote = noteStorage.createNote();
    this.notes.push(newNote);
    this.sidebar.renderNotesList(this.notes);
    this.selectNote(newNote.id);
  }

  setEditor(editor: BlockNoteEditor): void {
    this.editor = editor;
    this.setupEditorOnChange(editor);
  }

  private setupEditorOnChange(editor: BlockNoteEditor): void {
    editor.onChange(() => {
      const blocks = editor.document;
      void this.handleSave(blocks);
    });
  }

  private handleSave(blocks: Block[]): void {
    if (!this.activeNoteId) {
      return;
    }

    if (this.saveTimeoutId !== null) {
      clearTimeout(this.saveTimeoutId);
    }

    this.saveStatus.showSaving();

    const activeId = this.activeNoteId;
    this.saveTimeoutId = window.setTimeout(() => {
      try {
        const note = noteStorage.getNote(activeId);
        if (note) {
          const updatedNote: Note = {
            ...note,
            content: blocks,
            title: this.extractTitle(blocks),
          };
          noteStorage.saveNote(updatedNote);
          this.sidebar.refreshNote(updatedNote);
          this.saveStatus.showSaved();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to save note:", error);
        this.saveStatus.showError("Failed to save");
      }
    }, SAVE_DEBOUNCE_MS);
  }

  private extractTitle(blocks: Block[]): string {
    const headingText = findFirstTextBlock(
      blocks,
      (block) => block.type === "heading"
    );
    if (headingText) {
      return headingText;
    }

    const anyText = findFirstTextBlock(blocks);
    if (anyText) {
      return anyText.slice(0, 50) + (anyText.length > 50 ? "..." : "");
    }

    return "Untitled Note";
  }
}

async function init(): Promise<void> {
  const editorContainer = document.getElementById("editor");
  const saveStatusElement = document.getElementById("saveStatus");
  const notesListElement = document.getElementById("notesList");
  const newNoteBtn = document.getElementById("newNoteBtn");

  if (!editorContainer || !saveStatusElement || !notesListElement || !newNoteBtn) {
    throw new Error("Required DOM elements not found");
  }

  const saveStatus = new SaveStatus(saveStatusElement);

  // eslint-disable-next-line prefer-const
  let noteManager: NoteManager;

  const sidebar = new NoteSidebar(notesListElement, (id: string) => {
    noteManager.selectNote(id);
  });

  noteManager = new NoteManager(sidebar, saveStatus);

  newNoteBtn.addEventListener("click", () => {
    noteManager.createNewNote();
  });

  const initialContent = noteManager.initialize();

  let editor: BlockNoteEditor;
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    editor = await BlockNoteEditor.create({
      initialContent,
      schema: {
        blockSpecs: defaultBlockSpecs,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to initialize BlockNote editor:", error);
    saveStatus.showError("Failed to initialize editor");
    editorContainer.innerHTML =
      '<p style="padding: 20px; color: #f44336;">Failed to initialize editor. Please refresh the page.</p>';
    return;
  }

  editor.mount(editorContainer);
  noteManager.setEditor(editor);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void init());
} else {
  void init();
}

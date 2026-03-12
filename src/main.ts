import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { noteStorage } from "./storageService.js";
import type { Block } from "@blocknote/core";
import type { Note, NotesCollection } from "./types.js";
import { findFirstTextBlock, findFirstTextBlockPreferHeadings } from "./types.js";

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

    this.activeNoteId = this.notes[0].id;
    this.sidebar.renderNotesList(this.notes);
    this.sidebar.setActiveNote(this.activeNoteId);
    return this.notes[0]?.content;
  }

  selectNote(id: string): void {
    const note = this.notes.find((n) => n.id === id);
    if (!note) {
      console.error(`Note with id "${id}" not found`);
      this.saveStatus.showError("Note not found");
      return;
    }

    const saveSuccess = this.flushPendingSave();
    if (!saveSuccess) {
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
    let newNote: Note;
    try {
      newNote = noteStorage.createNote();
    } catch (error) {
      console.error("Failed to create note:", error);
      this.saveStatus.showError("Failed to create note");
      return;
    }
    const savedNote = noteStorage.getNote(newNote.id);
    if (!savedNote) {
      this.saveStatus.showError("Failed to create note");
      return;
    }
    this.notes.push(savedNote);
    this.sidebar.renderNotesList(this.notes);
    this.selectNote(newNote.id);
  }

  destroy(): void {
    this.flushPendingSave();
    if (this.saveTimeoutId !== null) {
      clearTimeout(this.saveTimeoutId);
      this.saveTimeoutId = null;
    }
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
        this.performSave(activeId, blocks);
        this.saveStatus.showSaved();
      } catch (error) {
        console.error("Failed to save note:", error);
        this.saveStatus.showError("Failed to save");
      }
    }, SAVE_DEBOUNCE_MS);
  }

  private extractTitle(blocks: Block[]): string {
    const result = findFirstTextBlockPreferHeadings(blocks);
    if (result) {
      if (result.isHeading) {
        return result.text;
      }
      return result.text.slice(0, 50) + (result.text.length > 50 ? "..." : "");
    }
    return "Untitled Note";
  }

  private performSave(noteId: string, blocks: Block[]): void {
    const note = noteStorage.getNote(noteId);
    if (note) {
      const updatedNote: Note = {
        ...note,
        content: blocks,
        title: this.extractTitle(blocks),
      };
      noteStorage.saveNote(updatedNote);
      this.sidebar.refreshNote(updatedNote);
    }
  }

  flushPendingSave(): boolean {
    if (this.saveTimeoutId !== null) {
      clearTimeout(this.saveTimeoutId);
      this.saveTimeoutId = null;
      if (this.editor && this.activeNoteId) {
        const blocks = this.editor.document;
        const activeId = this.activeNoteId;
        try {
          this.performSave(activeId, blocks);
        } catch (error) {
          console.error("Failed to save note:", error);
          this.saveStatus.showError("Failed to save");
          return false;
        }
      }
    }
    return true;
  }

  getActiveNoteId(): string | null {
    return this.activeNoteId;
  }
}

interface EditorAppProps {
  noteManager: NoteManager;
  initialContent: Block[] | undefined;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function EditorApp({ noteManager, initialContent }: EditorAppProps) {
  /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment,
     @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access,
     @typescript-eslint/no-unsafe-argument */
  const editor = useCreateBlockNote({
    initialContent,
  });

  useEffect(() => {
    if (editor) {
      noteManager.setEditor(editor);
    }
  }, [editor, noteManager]);

  if (!editor) {
    return React.createElement("div", {
      style: { padding: "40px", textAlign: "center", color: "#666" }
    }, "Loading editor...");
  }

  return React.createElement(BlockNoteView, {
    editor: editor,
    slashMenu: true,
    formattingToolbar: true,
    sideMenu: true,
  });
  /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment,
     @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access,
     @typescript-eslint/no-unsafe-argument */
}

function init(): void {
  const editorRootElement = document.getElementById("editor-root");
  const saveStatusElement = document.getElementById("saveStatus");
  const notesListElement = document.getElementById("notesList");
  const newNoteBtn = document.getElementById("newNoteBtn");

  if (!editorRootElement || !saveStatusElement || !notesListElement || !newNoteBtn) {
    throw new Error("Required DOM elements not found");
  }

  const saveStatus = new SaveStatus(saveStatusElement);

  const sidebar = new NoteSidebar(notesListElement, (id: string) => {
    noteManager.selectNote(id);
  });

  const noteManager = new NoteManager(sidebar, saveStatus);

  newNoteBtn.addEventListener("click", () => {
    noteManager.createNewNote();
  });

  const initialContent = noteManager.initialize();

  const root = createRoot(editorRootElement);
  root.render(
    React.createElement(EditorApp, {
      noteManager,
      initialContent,
    })
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void init());
} else {
  void init();
}

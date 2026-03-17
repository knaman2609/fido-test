import { v4 as uuidv4 } from 'uuid';
import { subDays, subHours, subMinutes } from 'date-fns';
import type { Note } from '../types/note';

export const mockNoteEmpty: Note = {
  id: uuidv4(),
  title: 'Empty Note',
  content: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockNoteSimple: Note = {
  id: uuidv4(),
  title: 'Shopping List',
  content: '- Milk\n- Eggs\n- Bread\n- Butter',
  createdAt: subHours(new Date(), 2),
  updatedAt: subMinutes(new Date(), 15),
};

export const mockNoteWithHeaders: Note = {
  id: uuidv4(),
  title: 'Project Ideas',
  content: `# Project Ideas

## Web Development
- Personal portfolio website
- Task management app
- Weather dashboard

## Mobile Apps
- Fitness tracker
- Recipe finder
- Language learning app`,
  createdAt: subDays(new Date(), 1),
  updatedAt: subHours(new Date(), 3),
};

export const mockNoteWithFormatting: Note = {
  id: uuidv4(),
  title: 'Meeting Notes',
  content: `# Team Meeting - ${new Date().toLocaleDateString()}

**Attendees:** John, Sarah, Mike, Emma

## Agenda
1. Project status update
2. Q4 planning
3. Budget review

## Action Items
- [ ] **John** to prepare the presentation
- [ ] *Sarah* to send follow-up emails
- [ ] ~~Mike~~ will handle the documentation

> Important: Next meeting scheduled for next Monday at 10 AM.`,
  createdAt: subDays(new Date(), 2),
  updatedAt: subDays(new Date(), 2),
};

export const mockNoteWithCode: Note = {
  id: uuidv4(),
  title: 'Code Snippets',
  content: `# Useful Code Snippets

## JavaScript Array Methods
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((a, b) => a + b, 0);
\`\`\`

## CSS Flexbox
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

## React Component
\`\`\`tsx
function Button({ onClick, children }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
\`\`\``,
  createdAt: subDays(new Date(), 5),
  updatedAt: subDays(new Date(), 3),
};

export const mockNoteOld: Note = {
  id: uuidv4(),
  title: 'Old Archive Note',
  content: `This is an old archived note from several weeks ago.

It contains some historical information that is no longer actively used but kept for reference.`,
  createdAt: subDays(new Date(), 30),
  updatedAt: subDays(new Date(), 25),
};

export const mockNotesArray: Note[] = [
  mockNoteSimple,
  mockNoteWithHeaders,
  mockNoteWithFormatting,
  mockNoteWithCode,
  mockNoteOld,
];

export const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: uuidv4(),
  title: 'New Note',
  content: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockNoteWithDate = (
  daysAgo: number,
  overrides: Partial<Note> = {}
): Note => {
  const date = subDays(new Date(), daysAgo);
  return {
    id: uuidv4(),
    title: `Note from ${daysAgo} days ago`,
    content: '',
    createdAt: date,
    updatedAt: date,
    ...overrides,
  };
};

export const generateMockNotes = (count: number): Note[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockNoteWithDate(index % 30, {
      title: `Note ${index + 1}`,
      content: `This is the content for note ${index + 1}.`,
    })
  );
};

export const markdownExamples = {
  heading1: '# Heading 1',
  heading2: '## Heading 2',
  heading3: '### Heading 3',
  bold: '**Bold text**',
  italic: '*Italic text*',
  strikethrough: '~~Strikethrough~~',
  inlineCode: '`inline code`',
  codeBlock: '```\ncode block\n```',
  unorderedList: '- Item 1\n- Item 2\n- Item 3',
  orderedList: '1. First\n2. Second\n3. Third',
  blockquote: '> This is a blockquote',
  link: '[Link text](https://example.com)',
  horizontalRule: '---',
  taskList: '- [ ] Unchecked task\n- [x] Checked task',
  table: `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |`,
};

export const testContent = {
  short: 'Short note content.',
  medium: `This is a medium-length note with multiple sentences. It contains some basic formatting like **bold** and *italic* text. This helps test how the editor handles moderately sized content.`,
  long: `# Comprehensive Test Document

This is a long-form document designed to test the editor's performance and rendering capabilities with substantial content.

## Section 1: Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Section 2: Lists and Formatting

### Unordered List
- First item with **bold** text
- Second item with *italic* text
- Third item with \`inline code\`

### Ordered List
1. First numbered item
2. Second numbered item
3. Third numbered item

## Section 3: Code Blocks

\`\`\`typescript
function example(): string {
  return "This is a code block";
}
\`\`\`

## Section 4: Blockquotes

> The only way to do great work is to love what you do.
> — Steve Jobs

## Conclusion

This document covers various markdown elements that might be encountered in real-world usage.`,
};

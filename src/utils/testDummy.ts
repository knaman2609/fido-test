import { v4 as uuidv4 } from 'uuid';
import { subDays, subHours, subMinutes } from 'date-fns';
import type { Note } from '../types/note';

/**
 * Test Dummy Utilities for Apple Notes Editor
 * 
 * This file provides mock data and helper functions for testing
 * components and utilities in the Apple Notes Editor application.
 */

// ============================================================================
// Markdown Content Examples
// ============================================================================

export const markdownExamples = {
  simple: `# Welcome to Notes

This is a simple note with basic formatting.`,

  withFormatting: `# Project Ideas

## Web Development
- **E-commerce platform** with React
- *Personal blog* using static site generators
- ~~Abandoned project~~ from last year

## Mobile Apps
1. Fitness tracker
2. Meditation guide
3. Recipe manager`,

  withCode: `# Code Snippets

Here's a JavaScript example:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

And some inline code: \`const x = 42\``,

  withLinks: `# Resources

Check out these links:
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- Internal reference to [[Another Note]]`,

  longContent: `# Meeting Notes - Q4 Planning

Attendees: Alice, Bob, Charlie, Diana

## Agenda
1. Review Q3 results
2. Discuss Q4 goals
3. Resource allocation
4. Timeline planning

## Action Items
- [ ] Prepare Q3 report - Alice
- [ ] Draft Q4 budget - Bob
- [ ] Schedule follow-up - Charlie

## Notes
The team agreed on aggressive but achievable targets for Q4. We need to focus on:
- Customer retention
- New feature development
- Performance improvements

Next meeting scheduled for next Tuesday at 2 PM.`,

  empty: '',

  onlyTitle: 'Just a title, no other content',
};

// ============================================================================
// Mock Note Objects
// ============================================================================

export const mockNoteEmpty: Note = {
  id: 'note-empty-001',
  title: 'Empty Note',
  content: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockNoteSimple: Note = {
  id: 'note-simple-001',
  title: 'Welcome to Notes',
  content: markdownExamples.simple,
  createdAt: subHours(new Date(), 2),
  updatedAt: subMinutes(new Date(), 30),
};

export const mockNoteWithFormatting: Note = {
  id: 'note-formatted-001',
  title: 'Project Ideas',
  content: markdownExamples.withFormatting,
  createdAt: subDays(new Date(), 1),
  updatedAt: subHours(new Date(), 4),
};

export const mockNoteWithCode: Note = {
  id: 'note-code-001',
  title: 'Code Snippets',
  content: markdownExamples.withCode,
  createdAt: subDays(new Date(), 2),
  updatedAt: subDays(new Date(), 2),
};

export const mockNoteWithLinks: Note = {
  id: 'note-links-001',
  title: 'Useful Resources',
  content: markdownExamples.withLinks,
  createdAt: subDays(new Date(), 3),
  updatedAt: subDays(new Date(), 1),
};

export const mockNoteLongContent: Note = {
  id: 'note-long-001',
  title: 'Meeting Notes - Q4 Planning',
  content: markdownExamples.longContent,
  createdAt: subDays(new Date(), 5),
  updatedAt: subDays(new Date(), 5),
};

export const mockNoteYesterday: Note = {
  id: 'note-yesterday-001',
  title: 'Yesterday\'s Thoughts',
  content: 'Some thoughts from yesterday that I wanted to capture.',
  createdAt: subDays(new Date(), 1),
  updatedAt: subDays(new Date(), 1),
};

export const mockNoteLastWeek: Note = {
  id: 'note-lastweek-001',
  title: 'Weekly Review',
  content: 'Review of the past week\'s accomplishments and challenges.',
  createdAt: subDays(new Date(), 6),
  updatedAt: subDays(new Date(), 6),
};

export const mockNoteOld: Note = {
  id: 'note-old-001',
  title: 'Old Archived Note',
  content: 'This is an older note from a while back.',
  createdAt: subDays(new Date(), 30),
  updatedAt: subDays(new Date(), 30),
};

// ============================================================================
// Note Collections
// ============================================================================

export const mockNotesArray: Note[] = [
  mockNoteSimple,
  mockNoteWithFormatting,
  mockNoteWithCode,
  mockNoteWithLinks,
  mockNoteLongContent,
];

export const mockNotesAllTypes: Note[] = [
  mockNoteEmpty,
  mockNoteSimple,
  mockNoteWithFormatting,
  mockNoteWithCode,
  mockNoteWithLinks,
  mockNoteLongContent,
  mockNoteYesterday,
  mockNoteLastWeek,
  mockNoteOld,
];

export const mockNotesEmpty: Note[] = [];

export const mockNotesSingle: Note[] = [mockNoteSimple];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates a mock note with customizable properties
 */
export function createMockNote(overrides: Partial<Note> = {}): Note {
  const now = new Date();
  return {
    id: uuidv4(),
    title: 'Untitled Note',
    content: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Creates a mock note with specific content
 */
export function createMockNoteWithContent(
  title: string,
  content: string,
  overrides: Partial<Omit<Note, 'title' | 'content'>> = {}
): Note {
  return createMockNote({
    title,
    content,
    ...overrides,
  });
}

/**
 * Creates multiple mock notes with sequential titles
 */
export function createMockNotes(count: number, baseTitle: string = 'Note'): Note[] {
  return Array.from({ length: count }, (_, index) =>
    createMockNote({
      title: `${baseTitle} ${index + 1}`,
      content: `Content for ${baseTitle.toLowerCase()} ${index + 1}`,
      createdAt: subMinutes(new Date(), count - index),
      updatedAt: subMinutes(new Date(), count - index),
    })
  );
}

/**
 * Creates a mock note with a specific age
 */
export function createMockNoteWithAge(
  daysAgo: number,
  overrides: Partial<Note> = {}
): Note {
  const createdAt = subDays(new Date(), daysAgo);
  return createMockNote({
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  });
}

/**
 * Creates a mock note that was recently updated
 */
export function createMockNoteRecentlyUpdated(
  minutesAgo: number = 5,
  overrides: Partial<Note> = {}
): Note {
  const createdAt = subDays(new Date(), 1);
  const updatedAt = subMinutes(new Date(), minutesAgo);
  return createMockNote({
    createdAt,
    updatedAt,
    ...overrides,
  });
}

// ============================================================================
// Test Scenarios
// ============================================================================

export const testScenarios = {
  emptyState: mockNotesEmpty,
  singleNote: mockNotesSingle,
  multipleNotes: mockNotesArray,
  allTypes: mockNotesAllTypes,
  recentlyUpdated: [
    createMockNoteRecentlyUpdated(5, { title: 'Just Updated' }),
    createMockNoteRecentlyUpdated(30, { title: 'Updated 30 min ago' }),
    createMockNoteRecentlyUpdated(60, { title: 'Updated 1 hour ago' }),
  ],
  variousDates: [
    createMockNoteWithAge(0, { title: 'Today\'s Note' }),
    createMockNoteWithAge(1, { title: 'Yesterday\'s Note' }),
    createMockNoteWithAge(3, { title: 'Three Days Ago' }),
    createMockNoteWithAge(7, { title: 'Last Week' }),
    createMockNoteWithAge(30, { title: 'Last Month' }),
  ],
};

// ============================================================================
// Export All
// ============================================================================

export default {
  markdownExamples,
  mockNoteEmpty,
  mockNoteSimple,
  mockNoteWithFormatting,
  mockNoteWithCode,
  mockNoteWithLinks,
  mockNoteLongContent,
  mockNoteYesterday,
  mockNoteLastWeek,
  mockNoteOld,
  mockNotesArray,
  mockNotesAllTypes,
  mockNotesEmpty,
  mockNotesSingle,
  createMockNote,
  createMockNoteWithContent,
  createMockNotes,
  createMockNoteWithAge,
  createMockNoteRecentlyUpdated,
  testScenarios,
};

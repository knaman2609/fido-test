import { v4 as uuidv4 } from 'uuid';
import type { Note } from '@/types/note';

export interface TestDocumentTemplate {
  id: string;
  name: string;
  category: string;
  generateContent: () => string;
}

interface LoremIpsumOptions {
  paragraphs?: number;
  sentencesPerParagraph?: number;
}

const loremIpsumWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
  'est', 'laborum'
];

const sampleTitles = [
  'Project Overview',
  'Meeting Notes',
  'Ideas & Thoughts',
  'Research Findings',
  'Daily Journal',
  'Task List',
  'Code Snippets',
  'Design Notes',
  'Book Summary',
  'Travel Plans',
  'Recipe Collection',
  'Workout Log',
  'Budget Planning',
  'Learning Notes',
  'Brainstorming Session'
];

const codeSnippets = {
  javascript: `function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}

const cart = [
  { price: 29.99, quantity: 2 },
  { price: 15.50, quantity: 1 }
];

console.log(calculateTotal(cart)); // 75.48`,

  typescript: `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

class UserManager {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }
}`,

  css: `.card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}`,

  json: `{
  "name": "apple-notes-editor",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  }
}`
};

export const generateLoremIpsum = (options: LoremIpsumOptions = {}): string => {
  const { paragraphs = 3, sentencesPerParagraph = 4 } = options;
  const result: string[] = [];

  for (let p = 0; p < paragraphs; p++) {
    const sentences: string[] = [];
    for (let s = 0; s < sentencesPerParagraph; s++) {
      const wordCount = Math.floor(Math.random() * 10) + 8;
      const words: string[] = [];
      for (let w = 0; w < wordCount; w++) {
        const word = loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)];
        words.push(w === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
      }
      sentences.push(words.join(' ') + '.');
    }
    result.push(sentences.join(' '));
  }

  return result.join('\n\n');
};

const getRandomTitle = (): string => {
  return sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
};

const getRandomDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const generateBasicFormattingContent = (): string => {
  const title = getRandomTitle();
  return `# ${title}

## Introduction

${generateLoremIpsum({ paragraphs: 1, sentencesPerParagraph: 3 })}

### Key Points

${generateLoremIpsum({ paragraphs: 1, sentencesPerParagraph: 2 })}

**Important:** This section contains *emphasized* content that demonstrates **bold** and *italic* text formatting.

> "${generateLoremIpsum({ paragraphs: 1, sentencesPerParagraph: 1 })}"
> — Anonymous

---

## Details

${generateLoremIpsum({ paragraphs: 2, sentencesPerParagraph: 3 })}

Learn more at [OpenAI](https://openai.com) or [GitHub](https://github.com).`;
};

const generateListsAndTasksContent = (): string => {
  const tasks = [
    { text: 'Review project requirements', checked: true },
    { text: 'Set up development environment', checked: true },
    { text: 'Create initial prototype', checked: false },
    { text: 'Write documentation', checked: false },
    { text: 'Conduct user testing', checked: false }
  ];

  const shuffledTasks = [...tasks].sort(() => Math.random() - 0.5);

  return `# Project Tasks

${generateLoremIpsum({ paragraphs: 1, sentencesPerParagraph: 2 })}

## Action Items

${shuffledTasks.map(task => `- [${task.checked ? 'x' : ' '}] ${task.text}`).join('\n')}

## Shopping List

- Milk
- Eggs
- Bread
- Coffee beans
- Fresh vegetables
- Olive oil

## Steps to Complete

1. Analyze the requirements thoroughly
2. Design the system architecture
3. Implement core features
4. Write unit tests
5. Perform integration testing
6. Deploy to production

## Nested Categories

- Frontend
  - React components
  - CSS styling
  - State management
- Backend
  - API endpoints
  - Database schema
  - Authentication
- DevOps
  - CI/CD pipeline
  - Monitoring
  - Logging`;
};

const generateCodeShowcaseContent = (): string => {
  const languages = Object.keys(codeSnippets) as Array<keyof typeof codeSnippets>;
  const selectedLang = languages[Math.floor(Math.random() * languages.length)];

  return `# Code Examples

${generateLoremIpsum({ paragraphs: 1, sentencesPerParagraph: 2 })}

## JavaScript Example

\`\`\`javascript
${codeSnippets.javascript}
\`\`\`

## TypeScript Example

\`\`\`typescript
${codeSnippets.typescript}
\`\`\`

## CSS Styling

\`\`\`css
${codeSnippets.css}
\`\`\`

## Configuration

\`\`\`json
${codeSnippets.json}
\`\`\`

## Inline Code

You can use \`console.log()\` for debugging or \`Array.map()\` for transformations.

${generateLoremIpsum({ paragraphs: 1, sentencesPerParagraph: 2 })}`;
};

const generateDataTablesContent = (): string => {
  return `# Data Tables

${generateLoremIpsum({ paragraphs: 1, sentencesPerParagraph: 2 })}

## Product Inventory

| Product | Category | Price | Stock |
|---------|----------|-------|-------|
| Laptop | Electronics | $999.99 | 15 |
| Mouse | Accessories | $29.99 | 50 |
| Keyboard | Accessories | $79.99 | 30 |
| Monitor | Electronics | $349.99 | 12 |
| Webcam | Accessories | $89.99 | 25 |

## Team Members

| Name | Role | Department | Status |
|------|------|------------|--------|
| Alice Johnson | Manager | Engineering | Active |
| Bob Smith | Developer | Engineering | Active |
| Carol White | Designer | Product | Away |
| David Brown | Analyst | Data | Active |

## Monthly Sales

| Month | Revenue | Expenses | Profit |
|:------|--------:|---------:|-------:|
| January | $45,000 | $32,000 | $13,000 |
| February | $52,000 | $35,000 | $17,000 |
| March | $48,000 | $30,000 | $18,000 |

${generateLoremIpsum({ paragraphs: 1, sentencesPerParagraph: 2 })}`;
};

const generateMixedContent = (): string => {
  const date = getRandomDate();

  return `# Meeting Notes: ${getRandomTitle()}

**Date:** ${date}
**Participants:** Alice, Bob, Carol, David

## Agenda

1. Project status review
2. Upcoming milestones
3. Resource allocation
4. Q&A session

## Discussion

${generateLoremIpsum({ paragraphs: 2, sentencesPerParagraph: 3 })}

### Key Decisions

> We agreed to prioritize the mobile experience and delay the desktop features to Q2.

## Action Items

- [ ] Alice to prepare wireframes by Friday
- [ ] Bob to review API documentation
- [ ] Carol to schedule user interviews
- [ ] David to update the project timeline

## Code Reference

\`\`\`typescript
interface Task {
  assignee: string;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
}
\`\`\`

## Budget Overview

| Item | Budget | Spent | Remaining |
|------|--------|-------|-----------|
| Development | $50,000 | $32,000 | $18,000 |
| Design | $20,000 | $15,000 | $5,000 |
| Marketing | $30,000 | $10,000 | $20,000 |

---

*Next meeting scheduled for next Tuesday at 2 PM.*`;
};

export const testDocumentTemplates: TestDocumentTemplate[] = [
  {
    id: 'basic-formatting',
    name: 'Basic Formatting',
    category: 'formatting',
    generateContent: generateBasicFormattingContent
  },
  {
    id: 'lists-tasks',
    name: 'Lists and Tasks',
    category: 'organization',
    generateContent: generateListsAndTasksContent
  },
  {
    id: 'code-showcase',
    name: 'Code Showcase',
    category: 'code',
    generateContent: generateCodeShowcaseContent
  },
  {
    id: 'data-tables',
    name: 'Data Tables',
    category: 'data',
    generateContent: generateDataTablesContent
  },
  {
    id: 'mixed-content',
    name: 'Mixed Content',
    category: 'mixed',
    generateContent: generateMixedContent
  }
];

const extractTitleFromContent = (content: string): string => {
  return content.split('\n')[0].replace(/^#+\s*/, '').trim() || 'Untitled';
};

export const generateTestDocument = (): Note => {
  const template = testDocumentTemplates[Math.floor(Math.random() * testDocumentTemplates.length)];
  const content = template.generateContent();
  const now = new Date();

  return {
    id: uuidv4(),
    title: extractTitleFromContent(content),
    content,
    createdAt: now,
    updatedAt: now
  };
};

export const generateMultipleTestDocuments = (count: number): Note[] => {
  const notes: Note[] = [];
  const usedTemplates = new Set<number>();

  for (let i = 0; i < count; i++) {
    let templateIndex: number;

    if (usedTemplates.size < testDocumentTemplates.length) {
      do {
        templateIndex = Math.floor(Math.random() * testDocumentTemplates.length);
      } while (usedTemplates.has(templateIndex));
      usedTemplates.add(templateIndex);
    } else {
      templateIndex = Math.floor(Math.random() * testDocumentTemplates.length);
    }

    const template = testDocumentTemplates[templateIndex];
    const content = template.generateContent();
    const now = new Date();
    now.setMilliseconds(now.getMilliseconds() + i);

    notes.push({
      id: uuidv4(),
      title: content.split('\n')[0].replace(/^#+\s*/, '').trim() || 'Untitled',
      content,
      createdAt: now,
      updatedAt: now
    });
  }

  return notes;
};

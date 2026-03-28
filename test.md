# Test Markdown File

This is a comprehensive test file for the Apple Notes Editor. It demonstrates various markdown features supported by Milkdown with GFM (GitHub Flavored Markdown).

---

## Headers

### H3 Header

#### H4 Header

##### H5 Header

###### H6 Header

---

## Text Formatting

This is a paragraph with **bold text**, *italic text*, and ***bold italic text***.

You can also use ~~strikethrough~~ for deleted text.

Here is some `inline code` within a sentence.

---

## Lists

### Unordered List

- First item
- Second item
  - Nested item 1
  - Nested item 2
    - Deeply nested item
- Third item

### Ordered List

1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

### Task List (GFM)

- [x] Completed task
- [ ] Incomplete task
- [ ] Another incomplete task
  - [x] Nested completed task
  - [ ] Nested incomplete task

---

## Code Blocks

### Inline Code

Use `console.log('Hello World')` to print to the console.

### Fenced Code Block

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(f"Fibonacci(10) = {fibonacci(10)}")
```

```css
.editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

---

## Blockquotes

> This is a simple blockquote.

> Blockquotes can contain multiple paragraphs.
>
> Like this one, which continues the quote above.

> Nested blockquotes:
>> This is a nested quote.
>>
>> It can also have multiple paragraphs.

> Blockquotes can also contain other elements:
> - List item 1
> - List item 2
>
> And **formatted text** too!

---

## Tables (GFM)

### Simple Table

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ Yes | H1-H6 supported |
| Lists | ✅ Yes | Ordered, unordered, and task lists |
| Code | ✅ Yes | Inline and fenced blocks |
| Tables | ✅ Yes | GFM style tables |

### Aligned Table

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left text    | Center text    | Right text    |
| Another left | Another center | Another right |
| Lorem ipsum  | Dolor sit      | Amet consect  |

---

## Links

### External Links

- [Milkdown Documentation](https://milkdown.dev)
- [GitHub](https://github.com)
- [Markdown Guide](https://www.markdownguide.org)

### Reference Links

Here's a [reference link][ref1] and another [reference link][ref2].

[ref1]: https://milkdown.dev "Milkdown"
[ref2]: https://github.com "GitHub"

---

## Horizontal Rules

Above the rule.

---

Below the rule.

***

Another style of rule.

___

Yet another style.

---

## Mixed Content Example

### Meeting Notes Template

**Date:** 2024-01-15  
**Attendees:** Alice, Bob, Charlie

#### Agenda

1. Review last week's action items
2. Discuss new features
3. Plan next sprint

#### Notes

> Alice mentioned that the **performance improvements** are showing great results.

Action items for next week:

| Task | Owner | Due Date | Status |
|------|-------|----------|--------|
| Optimize database queries | Bob | 2024-01-22 | 🟡 In Progress |
| Update documentation | Charlie | 2024-01-20 | 🟢 Done |
| Fix UI bugs | Alice | 2024-01-25 | 🔴 Not Started |

#### Code Snippet from Discussion

```typescript
interface Task {
  id: string;
  title: string;
  owner: string;
  dueDate: Date;
  status: 'todo' | 'in-progress' | 'done';
}

const tasks: Task[] = [
  {
    id: '1',
    title: 'Optimize database queries',
    owner: 'Bob',
    dueDate: new Date('2024-01-22'),
    status: 'in-progress'
  }
];
```

---

## Edge Cases

### Empty Elements

Empty line below:


Empty line above.

### Special Characters

Here are some special characters: < > & " ' ` * _ ~ [ ] ( ) { } # + - . !

### Escaped Characters

\*Not italic\*  
\`Not code\`  
\[Not a link\](url)

### Long Lines

This is a very long line that goes on and on to test how the editor handles wrapping and overflow. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

---

## End of Test File

This concludes the test markdown file. It should provide comprehensive coverage of the markdown features available in Milkdown with GFM support.

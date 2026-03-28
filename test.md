# Test Markdown File

This is a test markdown file for the Apple Notes Editor. It demonstrates various markdown features supported by the Milkdown editor with GFM (GitHub Flavored Markdown).

---

## Headers

# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header

---

## Text Formatting

This is a paragraph with **bold text**, *italic text*, and ***bold italic text***.

You can also use __underscores__ for _emphasis_ and ~~strikethrough~~ for deleted text.

This is `inline code` within a paragraph.

---

## Lists

### Unordered Lists

- First item
- Second item
  - Nested item 1
  - Nested item 2
    - Deeply nested item
- Third item

### Ordered Lists

1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

### Task Lists (GFM)

- [x] Completed task
- [ ] Incomplete task
- [ ] Another incomplete task
  - [x] Nested completed task
  - [ ] Nested incomplete task

---

## Code Blocks

### Inline Code

Use `console.log()` to print to the console.

### Fenced Code Blocks

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome, ${name}`;
}

greet('World');
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))
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

> This is a blockquote. It can span multiple lines and contain other markdown elements.
>
> > Nested blockquotes are also supported.
>
> - Lists inside blockquotes
> - **Bold text** and *italic text*

---

## Links

[Apple](https://www.apple.com) - External link

[Internal Link](#headers) - Link to a section in this document

<https://www.example.com> - Autolink

---

## Tables (GFM)

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ Yes | All 6 levels |
| Lists | ✅ Yes | Ordered, unordered, and task lists |
| Code Blocks | ✅ Yes | With syntax highlighting |
| Tables | ✅ Yes | GFM style |
| Blockquotes | ✅ Yes | Nested supported |
| Links | ✅ Yes | Internal and external |

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left text    | Center text    | Right text    |
| Another left | Another center | Another right |

---

## Horizontal Rules

Above the rule.

---

Below the rule.

***

Another style of horizontal rule.

___

Yet another style.

---

## Mixed Content Example

> ### Quote with a Header
>
> This blockquote contains:
> - A list item
> - **Bold text** for emphasis
> - A [link to Apple](https://www.apple.com)
>
> ```javascript
> // And even a code block
> const example = "Hello from a blockquote!";
> ```

---

## Emoji Support (if enabled)

🎉 Party popper
🚀 Rocket
💡 Light bulb
✅ Check mark
❌ Cross mark

---

## End of Test File

This concludes the test markdown file. It should provide a comprehensive test of the editor's rendering capabilities.

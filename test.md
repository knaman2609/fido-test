# Test Document for Apple Notes Editor

This document contains various markdown elements to test the editor's capabilities.

---

## Headings

# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

---

## Text Formatting

Regular paragraph text with **bold text**, *italic text*, and ***bold italic text***.

Also supporting ~~strikethrough~~ and `inline code`.

Here's a paragraph with mixed formatting: The **quick brown fox** *jumps over* the `lazy dog`.

---

## Lists

### Unordered Lists

- First item
- Second item
- Third item
  - Nested item 1
  - Nested item 2
    - Deeply nested item
- Fourth item

### Ordered Lists

1. First item
2. Second item
3. Third item
   1. Nested ordered item
   2. Another nested item
4. Fourth item

### Mixed Lists

1. First ordered item
   - Unordered sub-item
   - Another sub-item
2. Second ordered item
   1. Nested ordered
   2. Another nested ordered

---

## Code Blocks

### Inline Code

Use `console.log()` to print to the console in JavaScript.

### Fenced Code Blocks

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

print(fibonacci(10))
```

```css
.editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
```

---

## Blockquotes

> This is a simple blockquote.

> Blockquotes can also be nested:
>> This is a nested blockquote.
>> It can contain multiple lines.
> 
> Back to the first level.

> **Bold text** and *italic text* work in blockquotes too.
> 
> - Lists
> - Also work
> - Inside blockquotes

---

## Links and Images

### Links

[Apple](https://www.apple.com)

[Google](https://www.google.com "Google Search")

[Internal Link to Guide](guide.md)

### Reference-style Links

[Apple Notes Editor][1] is a markdown editor.

[1]: https://github.com/apple/notes-editor

---

## Tables

### Simple Table

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headings | ✅ Yes | All 6 levels |
| Bold | ✅ Yes | **text** |
| Italic | ✅ Yes | *text* |
| Code | ✅ Yes | `code` |

### Alignment

| Left | Center | Right |
|:-----|:------:|------:|
| L1   | C1     | R1    |
| L2   | C2     | R2    |
| L3   | C3     | R3    |

---

## Task Lists

- [x] Completed task
- [ ] Unchecked task
- [x] Another completed task
  - [x] Nested completed task
  - [ ] Nested unchecked task
- [ ] Final unchecked task

---

## Horizontal Rules

Three dashes:

---

Three asterisks:

***

Three underscores:

___

---

## Special Characters

### HTML Entities

- Copyright: &copy;
- Trademark: &trade;
- Registered: &reg;
- Euro: &euro;
- Arrow: &rarr;

### Emoji

🎉 Party popper
🔥 Fire
✨ Sparkles
💡 Light bulb
📝 Memo

---

## Mixed Content Example

> **Important Notice:**
> 
> This editor supports:
> 1. All standard markdown features
> 2. GitHub Flavored Markdown extensions
> 3. Custom plugins
> 
> ```javascript
> // Example code
> const editor = new AppleNotesEditor({
>   plugins: ['gfm', 'prism']
> });
> ```

| Plugin | Purpose | Status |
|--------|---------|--------|
| GFM | GitHub Flavored Markdown | ✅ Active |
| Prism | Syntax Highlighting | ✅ Active |
| Emoji | Emoji Support | ✅ Active |

- [x] Core functionality implemented
- [x] GFM support added
- [ ] Advanced features planned

---

## Testing Edge Cases

### Empty Elements

Empty line above and below this paragraph.



### Special Characters in Text

Special chars: < > & " ' ` ~ ! @ # $ % ^ & * ( ) _ + - = { } [ ] | \ : ; " ' < > , . ? /

### Long Lines

This is a very long line that might need to wrap depending on the container width. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Unicode

日本語テキスト
中文文本
العربية
עברית
Русский текст

---

*End of test document*

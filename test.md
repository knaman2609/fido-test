# Test Markdown File

This is a test markdown file for the Apple Notes Editor. It demonstrates various markdown features supported by the Milkdown editor.

## Headers

### H3 Header

#### H4 Header

##### H5 Header

###### H6 Header

## Text Formatting

This is **bold text** and this is *italic text*. You can also use ***bold and italic*** together.

This is ~~strikethrough text~~.

This is `inline code`.

## Lists

### Unordered List

- First item
- Second item
  - Nested item 1
  - Nested item 2
- Third item

### Ordered List

1. First item
2. Second item
   1. Nested item 1
   2. Nested item 2
3. Third item

### Task List

- [x] Completed task
- [ ] Incomplete task
- [ ] Another incomplete task

## Code Blocks

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to the editor, ${name}`;
}

greet('User');
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

## Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> > This is a nested blockquote.

## Links

[Visit GitHub](https://github.com)

[Link with title](https://example.com "Example Website")

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ | All levels |
| Lists | ✅ | Ordered, unordered, and tasks |
| Code | ✅ | Inline and blocks |
| Tables | ✅ | GFM style |
| Links | ✅ | Standard markdown |

## Horizontal Rule

---

## Mixed Content

Here's a paragraph with **bold**, *italic*, and `code` all mixed together.

> A blockquote with a [link](https://example.com) and **bold text**.

1. Ordered list with **bold**
2. Item with `code`
3. Item with [a link](https://github.com)

---

*End of test file*

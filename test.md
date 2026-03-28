# Test Markdown File

This is a test markdown file for the Apple Notes Editor. It demonstrates various markdown features supported by Milkdown with GFM (GitHub Flavored Markdown).

## Headers

### H3 Header

#### H4 Header

##### H5 Header

###### H6 Header

## Text Formatting

This is **bold text** and this is *italic text*. You can also use __underscores for bold__ and _underscores for italic_.

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
   1. Nested item A
   2. Nested item B
3. Third item

### Task List

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
- [ ] Another incomplete task

## Code Blocks

### JavaScript

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to Apple Notes Editor, ${name}!`;
}

greet('User');
```

### TypeScript

```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const note: Note = {
  id: '1',
  title: 'Test Note',
  content: 'This is a test note',
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### Python

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Print first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

## Blockquotes

> This is a blockquote.
>
> It can span multiple lines and contain **formatted text**.

> Nested blockquotes:
>> This is a nested blockquote.
>>
>> It can also contain multiple lines.

## Links

[Apple](https://www.apple.com)

[Google](https://www.google.com "Google's Homepage")

[Relative link to guide](./guide.md)

## Images

![Placeholder Image](https://via.placeholder.com/400x200/007AFF/FFFFFF?text=Apple+Notes+Editor)

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ | All 6 levels |
| Bold/Italic | ✅ | Standard markdown |
| Lists | ✅ | Ordered, unordered, and task lists |
| Code Blocks | ✅ | With syntax highlighting |
| Tables | ✅ | GFM style |
| Links | ✅ | External and relative |
| Blockquotes | ✅ | Nested supported |

## Horizontal Rule

---

## HTML (if supported)

<details>
<summary>Click to expand</summary>

This is hidden content that can be expanded.

</details>

## Math (if plugin enabled)

When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are:

$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}$$

---

*This test file was created for the Apple Notes Editor project.*

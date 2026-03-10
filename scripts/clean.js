import { rmSync } from 'fs';

try {
  rmSync('dist', { recursive: true, force: true });
  console.log('Cleaned dist directory');
} catch (e) {
  // ignore errors
}

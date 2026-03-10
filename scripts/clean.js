import { rmSync } from 'fs';

const targetDir = process.argv[2] || process.env.CLEAN_DIR || 'dist';

try {
  rmSync(targetDir, { recursive: true, force: true });
  console.log(`Cleaned ${targetDir} directory`);
} catch (e) {
  console.error(`Failed to clean ${targetDir} directory:`, e.message);
  process.exit(1);
}

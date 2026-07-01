import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    root: resolve(import.meta.dirname, '../..'),
    include: ['.claude/skills/**/*.eval.ts'],
    fileParallelism: false,
    // LLM calls are slow — give each test suite enough headroom
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
});

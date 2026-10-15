import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Engine tests live in ./test and import the engine by relative path.
        include: ['test/**/*.test.ts'],
        environment: 'node',
    },
});

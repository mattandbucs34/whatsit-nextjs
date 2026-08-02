import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
import path from 'path';

// Load env variables from .env.test for testing
dotenv.config({ path: '.env.test' });

export default defineConfig({
    test: {
        // Prevent concurrent DB wiping across test files
        fileParallelism: false,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});

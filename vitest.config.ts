import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

// Load env variables from .env.test for testing
dotenv.config({ path: '.env.test' });

export default defineConfig({
    test: {
        // any extra configurations
    },
});

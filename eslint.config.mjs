import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import stylistic from "@stylistic/eslint-plugin";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: { '@stylistic': stylistic },
        rules: {
            'no-unused-vars': ['error', { vars: 'all', args: 'after-used' }],
            'semi': ['error', 'always'],
            'comma-dangle': ['warn', {
                arrays: 'only-multiline',
                objects: 'only-multiline',
                imports: 'only-multiline',
                exports: 'only-multiline',
                functions: 'never',
            }],
            'no-unused-expressions': ['warn', { enforceForJSX: true }],
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
            '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: 'always' }],
            'no-restricted-imports': ['warn', {
                paths: [
                    {
                        name: '@mui/material',
                        message: 'Use direct imports instead: import Component from \'@mui/material/Component\';',
                    },
                    {
                        name: '@mui/icons-material',
                        message: 'Use direct imports instead: import Component from \'@mui/icons-material/Icon\';',
                    },
                ],
            }],
            'react/jsx-curly-brace-presence': ['warn', { props: 'always', children: 'ignore' }],
        }
    },
]);

export default eslintConfig;

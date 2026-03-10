// @ts-check
import tseslintParser from "@typescript-eslint/parser";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "*.js", "scripts/**"],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
    },
    rules: {
      ...tseslintPlugin.configs.recommended.rules,
      "no-console": "warn",
      "no-debugger": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/prefer-as-const": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "prefer-const": "warn",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "prefer-arrow-callback": "warn",
      "no-throw-literal": "off",
      "@typescript-eslint/only-throw-error": "error",
    },
  }
];
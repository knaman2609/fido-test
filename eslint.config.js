import js from "@eslint/js";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "scripts/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "off",
      "prefer-const": "warn",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "prefer-arrow-callback": "warn",
    },
  }
];

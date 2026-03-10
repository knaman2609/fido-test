module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  ignorePatterns: ["dist/**", "node_modules/**", "scripts/**"],
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
};

import js from "@eslint/js";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "scripts/**", "src/**"],
  },
  js.configs.recommended,
];

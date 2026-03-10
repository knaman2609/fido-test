import js from "@eslint/js";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "*.js", "scripts/**", "src/**/*.ts"],
  },
  js.configs.recommended,
];

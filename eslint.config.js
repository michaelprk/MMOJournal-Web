// ESLint flat config for JS/TS/React with Prettier
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "node_modules/",
      "backend/node_modules/",
      "build/",
      "backend/**",
      "backend/dist/**",
      "public/pokemmo-damage-calc/**",
      "third_party/**",
      ".react-router/**",
      ".eslintrc.cjs",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { react: reactPlugin, "react-hooks": reactHooks },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-empty": "off",
      "no-case-declarations": "off",
      "no-useless-escape": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  prettier,
];



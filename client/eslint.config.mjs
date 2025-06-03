import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-find-dom-node": "off",
      "@typescript-eslint/ban-types": "off",
      "@next/next/no-assign-module-variable": "off",
      "@typescript-eslint/ban-types": 'off',
      "node/no-deprecated-api": "off",
    },
  },
  {
    ignores: ["node_modules/", ".next/"],
  },
];

export default eslintConfig;

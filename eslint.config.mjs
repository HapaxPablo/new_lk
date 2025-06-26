import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextEslint from "next/core-web-vitals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  nextEslint,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
 {
    rules: {
      "prettier/prettier": "warn",
    },
  },
];

export default eslintConfig;

// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
    },

    plugins: {
      "@typescript-eslint": tseslint,
    },

    rules: {
      "@typescript-eslint/no-unused-vars": "warn", 
    },
  },

  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "pages/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@prisma/client",
              message: "❌ Do not import `@prisma/client` in frontend code. Use `@/prisma/prisma-types` instead.",
            },
          ],
        },
      ],
    },
  },
]);

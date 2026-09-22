import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Restrict both alias and relative imports across capability layers.
const outerImports = [
  "**/infrastructure/**", "**/interfaces/**", "**/composition/**", "**/app/**",
  "@/infrastructure", "@/composition", "@/app",
];
const frameworkImports = ["react", "react/*", "react-dom", "react-dom/*", "next", "next/*"];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "playwright-report/**", "test-results/**"]),
  {
    files: ["src/features/**/domain/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": ["error", { patterns: [
      ...outerImports, ...frameworkImports, "**/application/**", "@/ui", "@/ui/**",
    ] }] },
  },
  {
    files: ["src/features/**/application/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": ["error", { patterns: [...outerImports, ...frameworkImports, "@/ui", "@/ui/**"] }] },
  },
  {
    files: ["src/ui/**/*.{ts,tsx}", "src/infrastructure/api-client/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": ["error", { patterns: ["@/features/**", "**/features/**", "@/app/**", "**/composition/**"] }] },
  },
]);

import { cpSync } from "node:fs";

const root = new URL("../", import.meta.url);
for (const [source, target] of [
  ["public/", ".next/standalone/public/"],
  [".next/static/", ".next/standalone/.next/static/"],
]) {
  cpSync(new URL(source, root), new URL(target, root), { recursive: true });
}

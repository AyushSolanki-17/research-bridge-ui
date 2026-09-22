/** Reproduce transport types from the checksum-pinned temporary schema snapshot. */
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import openapiTS, { astToString } from "openapi-typescript";

const schemaUrl = new URL("../contracts/openapi.json", import.meta.url);
const provenance = JSON.parse(await readFile(new URL("../contracts/provenance.json", import.meta.url), "utf8"));
const schema = await readFile(schemaUrl);
if (createHash("sha256").update(schema).digest("hex") !== provenance.sha256) {
  throw new Error("Schema checksum mismatch; review and update contract provenance explicitly.");
}
const generator = JSON.parse(await readFile(new URL("../node_modules/openapi-typescript/package.json", import.meta.url), "utf8"));
if (generator.version !== provenance.generatorVersion) throw new Error("Pinned generator version mismatch.");
const output = astToString(await openapiTS(schemaUrl, { defaultNonNullable: false }));
const destination = new URL("../src/infrastructure/api-client/schema.d.ts", import.meta.url);
if (process.argv.includes("--check")) {
  if (await readFile(destination, "utf8") !== output) throw new Error("Generated client drift; run npm run generate:client.");
  console.log("Schema checksum and generated client verified.");
} else {
  await writeFile(destination, output);
}

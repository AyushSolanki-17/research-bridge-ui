/** Validate every synthetic response against its pinned OpenAPI operation and status. */
import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const schema = JSON.parse(await readFile(new URL("../contracts/openapi.json", import.meta.url), "utf8"));
const fixtures = JSON.parse(await readFile(new URL("../tests/fixtures/research.json", import.meta.url), "utf8"));
const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);
for (const [name, fixture] of Object.entries(fixtures)) {
  const response = schema.paths[fixture.path].post.responses[String(fixture.status)].content["application/json"].schema;
  const validate = ajv.compile({ ...response, components: schema.components });
  if (!validate(fixture.body)) throw new Error(`${name}: ${ajv.errorsText(validate.errors)}`);
}
console.log("All synthetic API response fixtures conform to the pinned schema.");

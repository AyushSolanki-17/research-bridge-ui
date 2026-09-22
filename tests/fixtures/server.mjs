/** Controlled API for production-browser tests; never part of the application runtime. */
import http from "node:http";
import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const fixtures = JSON.parse(await readFile(new URL("research.json", import.meta.url), "utf8"));
const schema = JSON.parse(await readFile(new URL("../../contracts/openapi.json", import.meta.url), "utf8"));
const ajv = new Ajv2020({ strict: false });
addFormats(ajv);
const validators = new Map(Object.entries(schema.paths).filter(([, value]) => value.post).map(([path, value]) => [
  path, ajv.compile({ ...value.post.requestBody.content["application/json"].schema, components: schema.components }),
]));
const server = http.createServer(async (request, response) => {
  response.setHeader("Content-Type", "application/json");
  if (request.url === "/health") { response.end('{"status":"ok"}'); return; }
  try {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    const validate = validators.get(request.url);
    if (!validate || !validate(body)) throw new Error("Invalid contract request");
    const name = request.url.endsWith("search") ? "search" : request.url.endsWith("resolve") ? "resolve" : "graph";
    const fixture = structuredClone(fixtures[name]);
    if (name === "graph") {
      fixture.body.mode = body.mode;
      fixture.body.limits = body.limits;
      fixture.body.filters = body.filters;
    }
    response.writeHead(fixture.status);
    response.end(JSON.stringify(fixture.body));
  } catch {
    response.writeHead(422);
    response.end(JSON.stringify({ error: { code: "invalid_fixture_request", message: "Request did not match the test API contract." } }));
  }
});
server.listen(4010, "127.0.0.1");

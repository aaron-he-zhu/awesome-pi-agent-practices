import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  createDiscoveryRegistryValidator,
  formatDiscoverySummary,
} from "./discovery-validation-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

const [registry, schema, resourcesRegistry] = await Promise.all([
  readJson("data/discovery-candidates.json"),
  readJson("data/discovery-candidates.schema.json"),
  readJson("data/resources.json"),
]);

const validate = createDiscoveryRegistryValidator(schema, resourcesRegistry);
const result = validate(registry);

if (!result.valid) {
  console.error(
    `Discovery candidate validation failed with ${result.failures.length} problem(s):`,
  );
  for (const failure of result.failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(formatDiscoverySummary(result.summary));
}

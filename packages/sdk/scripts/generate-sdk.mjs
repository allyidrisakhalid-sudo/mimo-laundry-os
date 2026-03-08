import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "..");
const specPath = path.join(root, "openapi", "openapi.json");
const outputPath = path.join(root, "src", "generated", "api.ts");
const cliPath = path.join(root, "..", "..", "node_modules", "openapi-typescript", "bin", "cli.js");

if (!fs.existsSync(specPath)) {
  console.error(`Saved OpenAPI snapshot not found: ${specPath}`);
  process.exit(1);
}

if (!fs.existsSync(cliPath)) {
  console.error(`openapi-typescript CLI not found: ${cliPath}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

execFileSync(process.execPath, [cliPath, specPath, "-o", outputPath], { stdio: "inherit" });

console.log(`Generated SDK types: ${outputPath}`);

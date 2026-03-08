import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "..");
const generatedPath = path.join(root, "src", "generated", "api.ts");

function fileHash(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(data).digest("hex");
}

const before = fileHash(generatedPath);

execFileSync(process.execPath, [path.join(root, "scripts", "generate-sdk.mjs")], {
  cwd: root,
  stdio: "inherit",
});

const after = fileHash(generatedPath);

if (before !== after) {
  console.error("SDK generated output was out of date. Run pnpm gen:sdk and commit the result.");
  process.exit(1);
}

console.log("SDK generated output is up to date.");

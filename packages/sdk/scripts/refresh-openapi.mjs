import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "..");
const specPath = path.join(root, "openapi", "openapi.json");

fs.mkdirSync(path.dirname(specPath), { recursive: true });

http
  .get("http://localhost:3001/api/openapi.json", (res) => {
    if (res.statusCode !== 200) {
      console.error(`Failed to fetch OpenAPI JSON. HTTP ${res.statusCode ?? "unknown"}`);
      process.exit(1);
    }

    let data = "";
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        JSON.parse(data);
      } catch {
        console.error("Fetched OpenAPI payload is not valid JSON.");
        process.exit(1);
      }

      fs.writeFileSync(specPath, data);
      console.log(`Saved OpenAPI snapshot: ${specPath}`);
    });
  })
  .on("error", (error) => {
    console.error(`Failed to fetch OpenAPI JSON: ${error.message}`);
    process.exit(1);
  });

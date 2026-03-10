import { spawn, spawnSync } from "node:child_process";

function runChecked(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runChecked("docker", ["compose", "up", "-d"]);

const child = spawn("pnpm", ["exec", "turbo", "run", "dev", "--parallel"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

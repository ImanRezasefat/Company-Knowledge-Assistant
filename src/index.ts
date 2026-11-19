import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const serverPath = fileURLToPath(new URL("../ui/server.mjs", import.meta.url));

const uiServer = spawn(process.execPath, [serverPath], {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

uiServer.on("error", (error) => {
  console.error(`Failed to start the UI server: ${error.message}`);
  process.exitCode = 1;
});

uiServer.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 0 : 1);
});

function stopUiServer() {
  if (!uiServer.killed) {
    uiServer.kill("SIGTERM");
  }
}

process.once("SIGINT", stopUiServer);
process.once("SIGTERM", stopUiServer);

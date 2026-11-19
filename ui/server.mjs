import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("./public/", import.meta.url));
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8" };

const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/ask") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; if (body.length > 10_000) req.destroy(); });
    req.on("end", () => {
      let question;
      try { question = JSON.parse(body).question?.trim(); } catch {}
      if (!question) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Enter a question first." }));
        return;
      }

      const child = spawn("npx", ["tsx", "src/scripts/test-rag.ts", question], { cwd: process.cwd() });
      let output = "";
      let errors = "";
      const timeout = setTimeout(() => child.kill("SIGTERM"), 120_000);
      child.stdout.on("data", (chunk) => { output += chunk.toString(); });
      child.stderr.on("data", (chunk) => { errors += chunk.toString(); });
      child.on("close", (code) => {
        clearTimeout(timeout);
        const answer = output.match(/\nAnswer:\s*\n([\s\S]*)$/)?.[1]?.trim();
        res.writeHead(code === 0 && answer ? 200 : 500, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(code === 0 && answer
          ? { answer }
          : { error: errors.trim() || output.trim() || "The answer service could not complete the request." }));
      });
      child.on("error", (error) => {
        clearTimeout(timeout);
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      });
    });
    return;
  }

  const pathname = req.url === "/" ? "/index.html" : decodeURIComponent(req.url.split("?")[0]);
  const file = normalize(join(root, pathname));
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404).end("Not found");
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => console.log(`Knowledge assistant ready at http://localhost:${port}`));

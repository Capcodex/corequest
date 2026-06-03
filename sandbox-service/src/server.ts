import { createServer } from "node:http";
import { executeRust } from "./executeRust.ts";
import type { SandboxExecutionStatus } from "./types.ts";
import type { SandboxExecutionRequest } from "./types.ts";

const port = Number.parseInt(process.env.PORT ?? "4000", 10);

const server = createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, service: "sandbox-service" }));
    return;
  }

  if (request.method === "POST" && request.url === "/execute") {
    try {
      const chunks: Buffer[] = [];

      for await (const chunk of request) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const payload = JSON.parse(Buffer.concat(chunks).toString("utf8")) as SandboxExecutionRequest;
      const result = await executeRust(payload.code);

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(result));
    } catch {
      const status: SandboxExecutionStatus = "sandbox_error";

      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({
          status,
          stdout: "",
          stderr: "Requête sandbox invalide.",
          durationMs: 0,
        }),
      );
    }
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Sandbox service listening on port ${port}`);
});

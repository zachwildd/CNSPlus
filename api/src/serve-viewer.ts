import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
// HERE -> cns/packages/webcomic-generator/src
const PACKAGE_ROOT = join(HERE, "..");
const VIEWER_DIR = join(PACKAGE_ROOT, "viewer");
const SHEETS_DIR = join(PACKAGE_ROOT, "out", "sheets");

const character = process.argv[2] ?? "airiona";
const sheetDir = join(SHEETS_DIR, character);

if (!existsSync(sheetDir)) {
  console.error(`No sheet directory at: ${sheetDir}`);
  console.error(`Run \`pnpm sheet\` first, or pass a character name: \`pnpm viewer <name>\`.`);
  process.exit(1);
}

const PORT = 4317;

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function mimeFor(path: string): string {
  return MIME[extname(path).toLowerCase()] ?? "application/octet-stream";
}

const CELL_PNG = /^\/[A-Za-z0-9_-]+\.png$/;

const server = createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", `http://localhost:${PORT}`).pathname;

  let filePath: string | undefined;
  if (path === "/" || path === "/index.html") {
    filePath = join(VIEWER_DIR, "index.html");
  } else if (path === "/manifest.json") {
    filePath = join(sheetDir, "manifest.json");
  } else if (CELL_PNG.test(path)) {
    filePath = join(sheetDir, path.slice(1));
  }

  if (!filePath) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
    return;
  }

  try {
    const data = await readFile(filePath);
    res.writeHead(200, {
      "content-type": mimeFor(filePath),
      "cache-control": "no-store",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log(`Viewing sheet for "${character}" at ${url}`);
  console.log(`  sheet dir: ${sheetDir}`);
  console.log(`Press Ctrl+C to stop.\n`);

  const opener =
    process.platform === "darwin" ? "open" :
    process.platform === "win32" ? "start" :
    "xdg-open";
  spawn(opener, [url], { stdio: "ignore", detached: true }).unref();
});

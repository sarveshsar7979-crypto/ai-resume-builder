// Renders scene.html into the hero poster + a 10s 1080p seamless loop.
// No npm packages needed: drives Chrome over its DevTools protocol and pipes
// frames to ffmpeg.
//
//   FFMPEG=/path/to/ffmpeg node design/hero-scene/capture.mjs   (from my-app/)
//
// Optional: CHROME_PATH, CRF (quality, default 23).
// Outputs: public/hero/hero-poster.jpg, public/hero/hero-1080p.mp4
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const FPS = 30;
const SECONDS = 10;
const PORT = 9333;
const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../../public/hero");
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const chrome = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
mkdirSync(outDir, { recursive: true });

const browser = spawn(chrome, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "hero-chrome-"))}`,
  "about:blank",
], { stdio: "ignore" });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  try {
    const url = pathToFileURL(join(here, "scene.html")).href + "?static";
    target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${url}`, { method: "PUT" })).json();
  } catch { await wait(200); }
}
if (!target) throw new Error("Could not reach Chrome");

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let nextId = 1;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
});
async function evaluate(expression) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method: "Runtime.evaluate", params: { expression, awaitPromise: true, returnByValue: true } }));
  const msg = await new Promise((r) => pending.set(id, r));
  if (msg.result?.exceptionDetails) throw new Error(JSON.stringify(msg.result.exceptionDetails));
  return msg.result.result.value;
}

await evaluate(`new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', () => r()))`);
await evaluate(`new Promise(r => { const c = () => window.SCENE ? r() : setTimeout(c, 50); c(); })`);
const frame = async (t) => {
  const url = await evaluate(`(SCENE.renderFrame(${t}), document.getElementById('c').toDataURL('image/jpeg', 0.95))`);
  return Buffer.from(url.split(",")[1], "base64");
};

writeFileSync(join(outDir, "hero-poster.jpg"), await frame(0));
console.log("poster written");

const enc = spawn(ffmpeg, [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-c:v", "mjpeg", "-framerate", String(FPS), "-i", "-",
  "-frames:v", String(FPS * SECONDS),
  "-c:v", "libx264", "-preset", "slow", "-crf", process.env.CRF ?? "23",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
  join(outDir, "hero-1080p.mp4"),
], { stdio: ["pipe", "inherit", "inherit"] });
const done = new Promise((r, j) => enc.on("close", (code) => (code === 0 ? r() : j(new Error(`ffmpeg exited ${code}`)))));

for (let i = 0; i < FPS * SECONDS; i++) {
  const buf = await frame(i / FPS);
  if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once("drain", r));
  if (i % 30 === 0) console.log(`frame ${i}/${FPS * SECONDS}`);
}
enc.stdin.end();
await done;
console.log("video written");
ws.close();
browser.kill();

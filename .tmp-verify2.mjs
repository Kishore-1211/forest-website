import puppeteer from "puppeteer-core";
import { writeFile } from "node:fs/promises";

const OUT_DIR = "C:\\Users\\91934\\AppData\\Local\\Temp\\claude\\C--Users-91934-forest-website\\e88c8ba9-316d-4aba-a89a-94f1e77e7f76\\scratchpad";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--window-size=1600,1000", "--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
  defaultViewport: { width: 1600, height: 1000 },
});

const page = await browser.newPage();
const consoleMsgs = [];
page.on("console", (msg) => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));
page.on("pageerror", (err) => consoleMsgs.push(`[pageerror] ${err.stack || err.message}`));
const netLog = [];
page.on("requestfinished", async (req) => {
  const url = req.url();
  if (url.includes("squirrel") || url.includes("models")) {
    const res = req.response();
    netLog.push(`FINISHED ${res?.status()} ${url} size=${(await res?.buffer())?.length ?? "?"}`);
  }
});
page.on("requestfailed", (req) => {
  if (req.url().includes("squirrel") || req.url().includes("models")) {
    netLog.push(`FAILED ${req.url()} :: ${req.failure()?.errorText}`);
  }
});

await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 1500));

await page.evaluate(() => {
  document.getElementById("squirrel-scene")?.scrollIntoView({ behavior: "instant", block: "start" });
});
await new Promise((r) => setTimeout(r, 4000));

// Inspect the three.js scene graph directly via the canvas' R3F internal state if reachable is hard;
// instead just check WebGL context exists and canvas isn't blank via pixel sampling.
const canvasInfo = await page.evaluate(() => {
  const canvas = document.querySelector("#squirrel-scene canvas");
  if (!canvas) return { found: false };
  return { found: true, width: canvas.width, height: canvas.height };
});

await writeFile(
  `${OUT_DIR}/console-log2.txt`,
  `ALL CONSOLE:\n${consoleMsgs.join("\n")}\n\nMODEL NETWORK:\n${netLog.join("\n")}\n\nCANVAS:\n${JSON.stringify(canvasInfo)}\n`,
);

await browser.close();
console.log("done");

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
page.on("pageerror", (err) => consoleMsgs.push(`[pageerror] ${err.message}`));
const failedRequests = [];
page.on("requestfailed", (req) => failedRequests.push(`${req.url()} :: ${req.failure()?.errorText}`));
const responses = [];
page.on("response", (res) => {
  if (res.status() >= 400) responses.push(`${res.status()} ${res.url()}`);
});

await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });

// Let LoadingScreen dismiss and Hero settle.
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: `${OUT_DIR}/01-hero.png` });

// Scroll to the squirrel section.
await page.evaluate(() => {
  document.getElementById("squirrel-scene")?.scrollIntoView({ behavior: "instant", block: "start" });
});
await new Promise((r) => setTimeout(r, 3000)); // let GLTF load + shadows compile
await page.screenshot({ path: `${OUT_DIR}/02-squirrel-enter.png` });

// Scroll further into the pinned track to sample mid-dolly framing.
await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.0));
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: `${OUT_DIR}/03-squirrel-mid.png` });

await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.0));
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: `${OUT_DIR}/04-squirrel-end.png` });

// Zoomed close-up on the model itself for texture/lighting inspection.
const canvas = await page.$("#squirrel-scene canvas");
if (canvas) {
  await canvas.screenshot({ path: `${OUT_DIR}/05-canvas-closeup.png` });
}

await writeFile(
  `${OUT_DIR}/console-log.txt`,
  `CONSOLE:\n${consoleMsgs.join("\n")}\n\nFAILED REQUESTS:\n${failedRequests.join("\n")}\n\nHTTP >=400:\n${responses.join("\n")}\n`,
);

await browser.close();
console.log("done");

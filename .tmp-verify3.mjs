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
const allReq = [];
page.on("request", (req) => allReq.push(req.url()));

await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 1000));

await page.evaluate(() => {
  document.getElementById("squirrel-scene")?.scrollIntoView({ behavior: "instant", block: "start" });
});
await new Promise((r) => setTimeout(r, 20000));

await writeFile(
  `${OUT_DIR}/console-log3.txt`,
  `ALL CONSOLE:\n${consoleMsgs.join("\n")}\n\nALL REQUESTS containing model/squirrel/gltf:\n${allReq.filter(u=>/model|squirrel|gltf|glb/i.test(u)).join("\n")}\n\nTOTAL REQUESTS: ${allReq.length}\n`,
);

await page.screenshot({ path: `${OUT_DIR}/06-longwait.png` });

await browser.close();
console.log("done");

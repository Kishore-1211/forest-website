import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const input = resolve(root, "public/videos/frames.mp4");
const output = resolve(root, "public/frames");

if (!existsSync(output)) mkdirSync(output, { recursive: true });

ffmpeg.setFfmpegPath(ffmpegStatic);

console.log("Extracting 480 WebP frames at 60 fps…");

ffmpeg(input)
  .outputOptions([
    "-vf", "fps=60",
    "-frames:v", "480",
    "-vcodec", "libwebp",
    "-quality", "85",
    "-compression_level", "4",
  ])
  .output(`${output}/frame_%04d.webp`)
  .on("progress", (p) => {
    if (p.frames) process.stdout.write(`\r  frames: ${p.frames}/480`);
  })
  .on("end", () => {
    console.log("\nDone — frames written to public/frames/");
  })
  .on("error", (err) => {
    console.error("FFmpeg error:", err.message);
    process.exit(1);
  })
  .run();

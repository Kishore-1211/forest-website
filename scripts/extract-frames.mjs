import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { mkdirSync, existsSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const input = resolve(root, "public/videos/frames.mp4");
const output = resolve(root, "public/frames");

/**
 * Frame budget for the scroll-scrubbed hero sequence.
 *
 * frames.mp4 is 8s at 24fps — 192 real frames. Extracting above that rate only
 * writes duplicated neighbours (the previous `fps=60` produced 480 files for the
 * same 192 distinct images, ~60% pure waste), so FPS is pinned to the source.
 *
 * WIDTH is 1280 rather than the source 1920: the sequence only ever paints as a
 * full-bleed `object-cover` backdrop behind text, where the extra pixels aren't
 * resolvable but cost ~2.25x the bytes per frame. Keep FRAME_COUNT in sync with
 * `frameCount` in HeroForest.tsx.
 */
const FPS = 24;
const FRAME_COUNT = 192;
const WIDTH = 1280;
/** libwebp: quality is perceptual (0-100); compression_level trades encode time for size. */
const QUALITY = 75;
const COMPRESSION_LEVEL = 6;

if (!existsSync(input)) {
  console.error(`Missing source video: ${input}`);
  process.exit(1);
}

// Clear stale frames so a lower FRAME_COUNT can't leave higher-numbered files
// from a previous run behind for the browser to keep fetching.
if (existsSync(output)) rmSync(output, { recursive: true });
mkdirSync(output, { recursive: true });

ffmpeg.setFfmpegPath(ffmpegStatic);

console.log(
  `Extracting ${FRAME_COUNT} WebP frames at ${FPS} fps, ${WIDTH}px wide (quality ${QUALITY})…`,
);

ffmpeg(input)
  .outputOptions([
    "-vf", `fps=${FPS},scale=${WIDTH}:-2:flags=lanczos`,
    "-frames:v", String(FRAME_COUNT),
    "-vcodec", "libwebp",
    "-quality", String(QUALITY),
    "-compression_level", String(COMPRESSION_LEVEL),
  ])
  .output(`${output}/frame_%04d.webp`)
  .on("progress", (p) => {
    if (p.frames) process.stdout.write(`\r  frames: ${p.frames}/${FRAME_COUNT}`);
  })
  .on("end", () => {
    console.log("\nDone — frames written to public/frames/");
  })
  .on("error", (err) => {
    console.error("FFmpeg error:", err.message);
    process.exit(1);
  })
  .run();

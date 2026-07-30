import { execFileSync } from "child_process";
import { mkdtempSync, rmSync, statSync, copyFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const modelsDir = resolve(root, "public/models");
const cli = resolve(root, "node_modules/.bin/gltf-transform");

/**
 * Shrinks the GLB models for web delivery. Build-time only — nothing here ships
 * to the browser.
 *
 * The sources are raw generator output (Tripo / pygltflib) with no compression
 * and no decimation: 1.27M triangles across three props, which is one to two
 * orders of magnitude past a real-time budget and contradicts ASSETS.md's
 * "low-poly geometry, optimized for real-time rendering".
 *
 * Pipeline per model: weld (merge duplicate verts so simplification has a
 * connected surface) -> simplify -> resize textures -> meshopt compress.
 *
 * `ratio` is the fraction of triangles to KEEP, tuned per model by how much
 * screen area it actually occupies: the rock renders 0.35 units tall, the tree
 * is background dressing, the squirrel is the section's focal point and gets the
 * largest budget. `error` caps allowed deviation as a fraction of mesh extent.
 *
 * Re-runnable: reads the pristine .orig.glb sidecar when present, otherwise
 * seeds it from the current file on first run, so repeated runs never
 * re-compress already-compressed output.
 */
const MODELS = [
  { file: "squirrel.glb", ratio: 0.25, error: 0.002, texture: 1024 },
  // Foliage needs a far larger share than its screen size suggests: the canopy
  // is thousands of thin, disconnected leaf shells, and collapsing those merges
  // them into visibly faceted blobs rather than thinning an even surface. 0.08
  // was clearly too aggressive on inspection.
  { file: "tree.glb", ratio: 0.22, error: 0.002, texture: 1024 },
  { file: "rock.glb", ratio: 0.06, error: 0.004, texture: 1024 },
];

const mb = (bytes) => (bytes / 1048576).toFixed(2);
const run = (args) => execFileSync(cli, args, { stdio: ["ignore", "pipe", "pipe"] });

if (!existsSync(cli)) {
  console.error("Missing @gltf-transform/cli — run: npm install");
  process.exit(1);
}

let before = 0;
let after = 0;

for (const { file, ratio, error, texture } of MODELS) {
  const target = join(modelsDir, file);
  const pristine = target.replace(/\.glb$/, ".orig.glb");

  if (!existsSync(target) && !existsSync(pristine)) {
    console.warn(`skip ${file} — not found`);
    continue;
  }
  // Preserve the untouched source once, so this script is idempotent.
  if (!existsSync(pristine)) copyFileSync(target, pristine);

  const tmp = mkdtempSync(join(tmpdir(), "glb-"));
  const step = (n) => join(tmp, `s${n}.glb`);

  try {
    const srcBytes = statSync(pristine).size;
    before += srcBytes;
    process.stdout.write(`${file}: ${mb(srcBytes)} MB`);

    run(["weld", pristine, step(1)]);
    run(["simplify", step(1), step(2), "--ratio", String(ratio), "--error", String(error)]);
    run(["resize", step(2), step(3), "--width", String(texture), "--height", String(texture)]);
    run(["meshopt", step(3), step(4)]);

    copyFileSync(step(4), target);
    const outBytes = statSync(target).size;
    after += outBytes;
    console.log(` -> ${mb(outBytes)} MB  (${(100 - (outBytes / srcBytes) * 100).toFixed(1)}% smaller)`);
  } catch (err) {
    console.error(`\nFailed on ${file}:`, err.stderr?.toString() || err.message);
    process.exit(1);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

console.log(`\nTotal: ${mb(before)} MB -> ${mb(after)} MB (${(100 - (after / before) * 100).toFixed(1)}% smaller)`);
console.log("Pristine sources kept alongside as *.orig.glb (gitignored).");

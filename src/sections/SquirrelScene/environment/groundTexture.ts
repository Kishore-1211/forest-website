import * as THREE from "three";

/**
 * Generates the forest-floor surface for Ground.tsx.
 *
 * There is no tileable ground asset in the project — /forest/grass.jpg is a
 * full scene photo (sky, sun, tree trunks), so repeating it across a plane lays
 * trunks flat on the floor. Synthesising the surface instead costs no download,
 * tiles seamlessly by construction, and yields a matching normal map, which is
 * what actually makes the ground catch light as a 3D surface rather than a
 * flat-lit sheet.
 */

const SIZE = 512;
/** Base lattice frequency; every octave doubles it, and all stay integers so
 *  the lattice wraps and the tile is seamless. */
const BASE_FREQ = 4;
const OCTAVES = 5;

function hash(x: number, y: number, seed: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Value noise on a wrapping lattice — seamless across the tile edge. */
function noise2D(u: number, v: number, freq: number, seed: number) {
  const x = u * freq;
  const y = v * freq;
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const at = (a: number, b: number) =>
    hash(((a % freq) + freq) % freq, ((b % freq) + freq) % freq, seed);

  const sx = smooth(xf);
  const sy = smooth(yf);
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(at(xi, yi), at(xi + 1, yi), sx),
    THREE.MathUtils.lerp(at(xi, yi + 1), at(xi + 1, yi + 1), sx),
    sy,
  );
}

/** Fractal sum — broad patches through to fine leaf-litter speckle. */
function fbm(u: number, v: number, seed: number) {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  for (let o = 0; o < OCTAVES; o += 1) {
    sum += noise2D(u, v, BASE_FREQ * 2 ** o, seed + o) * amp;
    norm += amp;
    amp *= 0.5;
  }
  return sum / norm;
}

/**
 * Warm forest floor: damp soil through dry leaf litter, with a little moss.
 * Deliberately light for base colour — the scene's ambient is low and the key
 * light rakes in near the horizon, so darker albedo here crushed the whole
 * floor to near-black and buried the surface detail entirely.
 */
const SOIL = new THREE.Color("#5d5343");
const LITTER = new THREE.Color("#9d8f78");
const MOSS = new THREE.Color("#66714a");

export interface GroundMaps {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  dispose: () => void;
}

export function createGroundMaps(repeat: number): GroundMaps {
  const height = new Float32Array(SIZE * SIZE);
  let lo = Infinity;
  let hi = -Infinity;
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const h = fbm(x / SIZE, y / SIZE, 11);
      height[y * SIZE + x] = h;
      if (h < lo) lo = h;
      if (h > hi) hi = h;
    }
  }
  // Summed octaves cluster tightly around the mean, so the raw field only ever
  // spans a narrow band — mapping colour straight off it produced a uniform
  // mud tone with no visible litter. Stretch to the full 0..1 range first.
  const span = Math.max(hi - lo, 1e-6);
  for (let i = 0; i < height.length; i += 1) height[i] = (height[i] - lo) / span;

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = colorCanvas.height = SIZE;
  const colorCtx = colorCanvas.getContext("2d")!;
  const colorData = colorCtx.createImageData(SIZE, SIZE);

  const normalCanvas = document.createElement("canvas");
  normalCanvas.width = normalCanvas.height = SIZE;
  const normalCtx = normalCanvas.getContext("2d")!;
  const normalData = normalCtx.createImageData(SIZE, SIZE);

  const shade = new THREE.Color();
  const wrap = (i: number) => (i + SIZE) % SIZE;

  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const i = y * SIZE + x;
      const h = height[i];
      // Independent field so moss patches don't simply follow the height.
      const mossMask = fbm(x / SIZE + 0.37, y / SIZE + 0.71, 29);

      shade.copy(SOIL).lerp(LITTER, THREE.MathUtils.smoothstep(h, 0.25, 0.85));
      shade.lerp(MOSS, THREE.MathUtils.smoothstep(mossMask, 0.55, 0.9) * 0.5);

      // Scattered dark flecks — twigs and leaf edges. Pure high-frequency, so
      // it survives at the tiling density without turning into visual noise.
      const fleck = noise2D(x / SIZE, y / SIZE, 128, 71);
      if (fleck > 0.82) shade.multiplyScalar(0.62);

      const o = i * 4;
      colorData.data[o] = shade.r * 255;
      colorData.data[o + 1] = shade.g * 255;
      colorData.data[o + 2] = shade.b * 255;
      colorData.data[o + 3] = 255;

      // Central-difference gradient of the height field -> tangent-space normal.
      // Sampling wraps, so the normal map tiles as cleanly as the colour does.
      const dx = height[y * SIZE + wrap(x + 1)] - height[y * SIZE + wrap(x - 1)];
      const dy = height[wrap(y + 1) * SIZE + x] - height[wrap(y - 1) * SIZE + x];
      const STRENGTH = 6;
      const nx = -dx * STRENGTH;
      const ny = -dy * STRENGTH;
      const len = Math.hypot(nx, ny, 1);

      normalData.data[o] = ((nx / len) * 0.5 + 0.5) * 255;
      normalData.data[o + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      normalData.data[o + 2] = (1 / len) * 0.5 * 255 + 127.5;
      normalData.data[o + 3] = 255;
    }
  }

  colorCtx.putImageData(colorData, 0, 0);
  normalCtx.putImageData(normalData, 0, 0);

  const configure = (texture: THREE.CanvasTexture, srgb: boolean) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    texture.anisotropy = 8;
    if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  };

  const map = configure(new THREE.CanvasTexture(colorCanvas), true);
  const normalMap = configure(new THREE.CanvasTexture(normalCanvas), false);

  return {
    map,
    normalMap,
    dispose: () => {
      map.dispose();
      normalMap.dispose();
    },
  };
}

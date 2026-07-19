// Generate a wavesurfer-compatible peaks JSON from a media file using ffmpeg.
// Usage: node tools/gen-peaks.mjs <input-media> <output-json> [numPeaks]
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const input = process.argv[2];
const output = process.argv[3];
const numPeaks = parseInt(process.argv[4] || "1000", 10);

if (!input || !output) {
  console.error("Usage: node tools/gen-peaks.mjs <input> <output.json> [numPeaks]");
  process.exit(1);
}

// Decode to mono signed 16-bit little-endian PCM at 8kHz (enough detail for a waveform).
const res = spawnSync(
  "ffmpeg",
  ["-v", "error", "-i", input, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"],
  { maxBuffer: 1024 * 1024 * 512, encoding: "buffer" }
);

if (res.status !== 0) {
  console.error("ffmpeg failed:", res.stderr && res.stderr.toString());
  process.exit(1);
}

const buf = res.stdout;
const sampleCount = Math.floor(buf.length / 2);
const samplesPerBucket = Math.max(1, Math.floor(sampleCount / numPeaks));
const peaks = [];
let globalMax = 0;

for (let i = 0; i < numPeaks; i++) {
  const start = i * samplesPerBucket;
  const end = Math.min(sampleCount, start + samplesPerBucket);
  let max = 0;
  for (let j = start; j < end; j++) {
    const v = Math.abs(buf.readInt16LE(j * 2)) / 32768;
    if (v > max) max = v;
  }
  peaks.push(max);
  if (max > globalMax) globalMax = max;
}

// Normalize so the loudest peak reaches 1.
const norm = globalMax > 0 ? 1 / globalMax : 1;
const normalized = peaks.map((v) => Math.round(v * norm * 1000) / 1000);

writeFileSync(output, JSON.stringify({ version: 2, channels: 1, data: normalized }));
console.log(`Wrote ${normalized.length} peaks to ${output}`);

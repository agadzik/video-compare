import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const BASE_URL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

export async function load(ffmpeg: FFmpeg) {
  ffmpeg.on("log", ({ message }) => {
    console.log(message);
  });

  const [coreURL, wasmURL, monoFont] = await Promise.all([
    toBlobURL(`${BASE_URL}/ffmpeg-core.js`, "text/javascript"),
    toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
    // toBlobURL(`${BASE_URL}/ffmpeg-core.worker.js`, "text/javascript"),
    fetchFile("GeistMonoVariableVF.ttf"),
  ]);

  const isLoaded = await ffmpeg.load({
    coreURL,
    wasmURL,
    // workerURL,
  });

  await ffmpeg.writeFile("monospace.ttf", monoFont);

  return isLoaded;
}

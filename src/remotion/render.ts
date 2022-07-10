import path from "path";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";
import fs from "fs/promises"
import { config } from "../config.js";

export const start = async (folder: string, tiktok = false) => {
  const compositionId = config.remotion.composition;

  const entry = "./src/remotion/index";
  console.log("Creating a Webpack bundle of the video");
  const bundleLocation = await bundle(path.resolve(entry), undefined,
    {
      webpackOverride: (currentConfiguration => {
        return {
          ...currentConfiguration,
          module: {
            ...currentConfiguration.module,
            rules: [
              ...(currentConfiguration.module?.rules ? currentConfiguration.module.rules : []).filter(rule => {
                if (rule === '...') {
                  return false
                }
                if (rule.test?.toString().includes('.css')) {
                  return false
                }
                return true
              }),
              {
                test: /\.css$/i,
                use: [
                  'style-loader',
                  'css-loader',
                  {
                    loader: 'postcss-loader',
                    options: {
                      postcssOptions: {
                        plugins: ['postcss-preset-env', 'tailwindcss', 'autoprefixer'],
                      },
                    },
                  },
                ],
              },
            ],
          },
        }
      })
    });

  const inputProps = JSON.parse(await fs.readFile(`./videos/${folder}/script.json`, "utf8"));

  const comps = await getCompositions(bundleLocation, {
    inputProps: { ...inputProps, tiktok },
  });
  if (!tiktok) {
    const imageComposition = comps.find((c) => c.id === config.remotion.still);
    if (!imageComposition)
      throw new Error(`No thumbnail composition found.`);

    const imageOutputLocation = `./videos/${folder}/thumbnail.png`;
    console.log("Attempting to render:", imageOutputLocation);
    await renderStill({
      composition: imageComposition,
      serveUrl: bundleLocation,
      output: imageOutputLocation,
      inputProps,
    });
    console.log("Thumbnail rendered:", imageOutputLocation);
  }

  const composition = comps.find((c) => c.id === compositionId);

  if (!composition) {
    throw new Error(`No composition with the ID ${compositionId} found`);
  }

  const outputLocation = `./videos/${folder}/${tiktok ? "tiktok.mp4" : "video.mp4"}`;
  console.log("Attempting to render:", outputLocation);
  let frames = 1;
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps,
    onProgress: (progress) => process.stdout.write(`Rendering: ${progress.renderedFrames}/${frames} or ${Math.round(progress.renderedFrames / frames * 100)}%, total ${Math.round(frames / config.remotion.fps)}s \r`),
    onStart: (data => frames = data.frameCount)
  });
  console.log("Render done!");
};


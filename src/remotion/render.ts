import path from "path";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import fs from "fs/promises"
import { config } from "../config.js";

export const start = async (folder: string) => {
  const compositionId = config.remotion.composition;

  // You only have to do this once, you can reuse the bundle.
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

  // Parametrize the video by passing arbitrary props to your component.
  const inputProps = JSON.parse(await fs.readFile(`./videos/${folder}/script.json`, "utf8"));

  // Extract all the compositions you have defined in your project
  // from the webpack bundle.
  const comps = await getCompositions(bundleLocation, {
    // You can pass custom input props that you can retrieve using getInputProps()
    // in the composition list. Use this if you want to dynamically set the duration or
    // dimensions of the video.
    inputProps,
  });

  // Select the composition you want to render.
  const composition = comps.find((c) => c.id === compositionId);

  // Ensure the composition exists
  if (!composition) {
    throw new Error(`No composition with the ID ${compositionId} found.
  Review "${entry}" for the correct ID.`);
  }

  const outputLocation = `./videos/${folder}/video.mp4`;
  console.log("Attempting to render:", outputLocation);
  let frames = 1;
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps,
    onProgress: (progress) => process.stdout.write(`Rendering: ${progress.renderedFrames}/${frames} frames or ${Math.round(progress.renderedFrames/frames *100)}% \r`),
    onStart: (data => frames = data.frameCount)
  });
  console.log("Render done!");
};


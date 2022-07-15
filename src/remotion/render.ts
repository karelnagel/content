import path from "path";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";
import { config } from "../config.js";
import { readJson, writeJson } from "../file/index.js";
// import { uploadToBucket } from "../upload/index.js";
import { Script } from "../interfaces/index.js";
import AWS from 'aws-sdk'
import fs from 'fs/promises'

export const createBundle = async () => await bundle(path.resolve("./src/remotion/index"), undefined,
  {
    webpackOverride: ((currentConfiguration) => {
      return {
        ...currentConfiguration,
        module: {
          ...currentConfiguration.module,
          rules: [
            ...(currentConfiguration.module?.rules
              ? currentConfiguration.module.rules
              : []
            ).filter((rule) => {
              if (rule === "...") {
                return false;
              }
              if (rule.test?.toString().includes(".css")) {
                return false;
              }
              return true;
            }),
            {
              test: /\.css$/i,
              use: [
                "style-loader",
                "css-loader",
                {
                  loader: "postcss-loader",
                  options: {
                    postcssOptions: {
                      plugins: [
                        "postcss-preset-env",
                        "tailwindcss",
                        "autoprefixer",
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
      };
    })
  });

export const tiktokFolder = (tiktok = false) => tiktok ? "tiktok" : "youtube"

export const renderThumbnail = async (folder: string, tiktok = false) => {
  console.log("Starting render");
  const serveUrl = await createBundle()
  const inputProps = await readJson(folder)
  const comps = await getCompositions(serveUrl, {
    inputProps: { ...inputProps, tiktok },
  });
  const composition = comps.find((c) => c.id === config.remotion.still);
  if (!composition)
    throw new Error(`No thumbnail composition found.`);

  const output = `./${config.folderPath}/${folder}/${tiktokFolder(tiktok)}/${config.thumbnail}`;
  console.log("Attempting to render:", output);
  await renderStill({
    composition,
    serveUrl,
    output,
    inputProps,
  });
  console.log("Thumbnail rendered:", output);
  const url = "change to aws s3"
  // const url = await uploadToBucket(`${folder}/${tiktokFolder(tiktok)}`, config.thumbnail);
  const newJson: Script = tiktok ?
    { ...inputProps, tiktokUpload: { ...inputProps.tiktokUpload, thumbnail: url } } :
    { ...inputProps, youtubeUpload: { ...inputProps.youtubeUpload, thumbnail: url } }
  await writeJson(newJson, folder)
  return url
};


export const render = async (folder: string, tiktok = false) => {
  console.log("Starting render");
  const serveUrl = await createBundle()
  const inputProps = await readJson(folder)
  const comps = await getCompositions(serveUrl, {
    inputProps: { ...inputProps, tiktok },
  });
  const composition = comps.find((c) => c.id === config.remotion.composition);
  if (!composition)
    throw new Error(`No thumbnail composition found.`);

  const outputLocation = `${config.folderPath}/${folder}/${tiktokFolder(tiktok)}/${config.video}`;
  console.log("Attempting to render:", outputLocation);
  let frames = 1;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation,
    inputProps,
    onProgress: (progress) => process.stdout.write(`Rendering: ${progress.renderedFrames}/${frames} or ${Math.round(progress.renderedFrames / frames * 100)}%, total ${Math.round(frames / config.remotion.fps)}s \r`),
    onStart: (data => frames = data.frameCount)
  });
  console.log("Render done!");

  // const url = await uploadToBucket(`${folder}/${tiktokFolder(tiktok)}`, config.video);
  const url = await uploadToAWS(outputLocation)

  const newJson: Script = tiktok ?
    { ...inputProps, tiktokUpload: { ...inputProps.tiktokUpload, url: url } } :
    { ...inputProps, youtubeUpload: { ...inputProps.youtubeUpload, url: url } }
  await writeJson(newJson, folder)
  return url
};

const s3 = new AWS.S3()
export const uploadToAWS = async (outputLocation: string) => {
  const file = await fs.readFile(outputLocation)
  const result = await s3.upload({
    Bucket: process.env.LAMBDA_BUCKET ?? "",
    Key: outputLocation,
    Body: file,
  }).promise()
  return result.Location
}

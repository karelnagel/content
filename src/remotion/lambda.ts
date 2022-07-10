import fs from "fs/promises"
import { getRenderProgress, renderMediaOnLambda, renderStillOnLambda } from "@remotion/lambda"
import { config } from "../config.js";

export const render = async (folder: string, tiktok = false) => {

  const inputProps = JSON.parse(await fs.readFile(`./videos/${folder}/script.json`, "utf8"));

  const serveUrl = "https://remotionlambda-lfdvz1islw.s3.us-east-1.amazonaws.com/sites/95g567qnd4/index.html"
  const functionName = "remotion-render-2022-07-09-mem2048mb-disk512mb-120sec"
  const region = "us-east-1"

  const { url } = await renderStillOnLambda({
    region,
    functionName,
    serveUrl,
    composition: "Thumbnail",
    inputProps: { ...inputProps, tiktok },
    imageFormat: "png",
    maxRetries: 1,
    privacy: "public",
    envVariables: {}
  });
  console.log("thumbnail", url)

  const { bucketName, renderId } = await renderMediaOnLambda({
    region,
    functionName,
    composition: "Video",
    serveUrl,
    inputProps: { ...inputProps, tiktok },
    codec: "h264",
    imageFormat: "jpeg",
    maxRetries: 1,
    privacy: "public",
    outName: "video.mp4",

  });

  let progress = await getRenderProgress({
    renderId,
    bucketName,
    functionName,
    region
  });

  while (!progress.done) {
    progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName,
      region
    });
    process.stdout.write(`\rRendering: ${progress.encodingStatus?.framesEncoded}/${progress.encodingStatus?.totalFrames}, ${Math.round((progress.encodingStatus?.framesEncoded || 1) / (progress.encodingStatus?.totalFrames || 1) * 100)}%, ${progress.encodingStatus?.totalFrames || 0 / config.remotion.fps}s, ${progress.costs.displayCost} `)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\nErrors: ${progress.errors}`)
  console.log(progress.outputFile)
};


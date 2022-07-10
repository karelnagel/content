import { getRenderProgress, renderMediaOnLambda, renderStillOnLambda } from "@remotion/lambda"
import { Script } from "../interfaces/index.js";
import { config } from "../config.js";
import { readJson, writeJson } from "../file/index.js";

const serveUrl = process.env.LAMBDA_SERVE_URL ?? ""
const functionName = process.env.LAMBDA_FUNCTION_NAME ?? ""
const region = "us-east-1"

export const lambdaThumbnail = async (folder: string, tiktok = false) => {
  const inputProps = await readJson(folder)

  const { url } = await renderStillOnLambda({
    region,
    functionName,
    serveUrl,
    composition: config.remotion.still,
    inputProps: { ...inputProps, tiktok },
    imageFormat: "png",
    maxRetries: 1,
    privacy: "public",
    envVariables: {}
  });
  const newJson: Script = tiktok ?
    { ...inputProps, tiktokUpload: { ...inputProps.tiktokUpload, thumbnail: url } } :
    { ...inputProps, youtubeUpload: { ...inputProps.youtubeUpload, thumbnail: url } }
  await writeJson(newJson, folder)
};


export const lambda = async (folder: string, tiktok = false) => {
  const inputProps = await readJson(folder)

  const { bucketName, renderId } = await renderMediaOnLambda({
    region,
    functionName,
    composition: config.remotion.composition,
    serveUrl,
    inputProps: { ...inputProps, tiktok },
    codec: "h264",
    imageFormat: "jpeg",
    maxRetries: 1,
    privacy: "public",
    // outName: {key:"render.mp4",bucketName:"df"}
    outName: "video.mp4"

  });
  const getProgress = async () => await getRenderProgress({
    renderId,
    bucketName,
    functionName,
    region
  });
  let progress = await getProgress()

  while (!progress.done) {
    progress = await getProgress()
    process.stdout.write(`\rRendering: ${progress.encodingStatus?.framesEncoded}/${progress.encodingStatus?.totalFrames}, ${Math.round((progress.encodingStatus?.framesEncoded || 1) / (progress.encodingStatus?.totalFrames || 1) * 100)}%, ${progress.encodingStatus?.totalFrames || 0 / config.remotion.fps}s, ${progress.costs.displayCost} `)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (progress.errors)
    console.log(`\nErrors: ${progress.errors}`)

  const newJson: Script = tiktok ?
    { ...inputProps, tiktokUpload: { ...inputProps.tiktokUpload, url: progress.outputFile ?? undefined } } :
    { ...inputProps, youtubeUpload: { ...inputProps.youtubeUpload, url: progress.outputFile ?? undefined } }
  await writeJson(newJson, folder)
};


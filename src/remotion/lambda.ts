import { downloadMedia, getRenderProgress, renderMediaOnLambda, renderStillOnLambda } from "@remotion/lambda"
import { Script } from "../interfaces/index.js";
import { config } from "../config.js";
import { readJson, writeJson } from "../file/index.js";
import { tiktokFolder } from "./render.js";

const serveUrl = process.env.LAMBDA_SERVE_URL ?? ""
const functionName = process.env.LAMBDA_FUNCTION_NAME ?? ""
const region = process.env.LAMBDA_REGION === "us-east-1" ? "us-east-1" : "us-east-2"
const bucketName = process.env.LAMBDA_BUCKET ?? ""

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
    envVariables: {},
    // outName: { key: `${config.folderPath}/${folder}/${tiktokFolder(tiktok)}/video.mp4`, bucketName: process.env.LAMBDA_BUCKET ?? "" }

  });
  const newJson: Script = tiktok ?
    { ...inputProps, tiktokUpload: { ...inputProps.tiktokUpload, thumbnail: url } } :
    { ...inputProps, youtubeUpload: { ...inputProps.youtubeUpload, thumbnail: url } }
  console.log(`Thumbnail: ${url}`)
  await writeJson(newJson, folder)
};


export const lambda = async (folder: string, tiktok = false) => {
  const inputProps = await readJson(folder)
  const { renderId } = await renderMediaOnLambda({
    region,
    functionName,
    composition: config.remotion.composition,
    serveUrl,
    inputProps: { ...inputProps, tiktok },
    codec: "h264",
    imageFormat: "jpeg",
    maxRetries: 1,
    privacy: "public",
    outName: { key: `${config.folderPath}/${folder}/${tiktokFolder(tiktok)}/video.mp4`, bucketName }

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
    console.log(progress)
    process.stdout.write(`Rendering: ${Math.round(progress.overallProgress * 100)}% ${progress.encodingStatus?.framesEncoded} / ${progress.encodingStatus?.totalFrames} frames, ${progress.costs.displayCost} \r`)
    if (progress.errors.length > 0) break;
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  if (progress.errors.length > 0)
    console.log(`\nError with rendering: ${JSON.stringify(progress.errors)}`)
  else {
    const newJson: Script = tiktok ?
      { ...inputProps, tiktokUpload: { ...inputProps.tiktokUpload, url: progress.outputFile ?? undefined } } :
      { ...inputProps, youtubeUpload: { ...inputProps.youtubeUpload, url: progress.outputFile ?? undefined } }
    await writeJson(newJson, folder)
    // if (tiktok) await download(folder, renderId)
    console.log(`\nFinished rendering with ${progress.costs.displayCost}`)
  }
};
export const download = async (folder: string, renderId: string) => {
  console.log(`\nDownloading ${folder}`)
  const { outputPath } = await downloadMedia({
    bucketName,
    region,
    renderId,
    outPath: `videos/tiktok/${folder}.mp4`,
    onProgress: ({ percent }) => {
      process.stdout.write(`Download progress: ${(percent * 100).toFixed(0)}%\r`);
    },
  });
  return outputPath
}

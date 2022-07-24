import { startToSpeech } from "./amazon/index.js";
import { ec, ec2Start, ec2Stop } from "./amazon/ec2.js";
import { getLength } from "./file/index.js";
import { downloadImage, downloadVideo } from "./pixabay/index.js";
import reddit from "./reddit/index.js";
import { lambda, lambdaThumbnail } from "./remotion/lambda.js";
import { render, renderThumbnail } from "./remotion/render.js";
import { post } from "./upload/index.js";

export async function oneThread(programs: string[], folder: string, video?: string, image?: string) {
  for (const program of programs) {
    switch (program) {
      case "reddit":
        await reddit(folder)
        break;
      case "tts":
        await startToSpeech(folder)
        break;

      case "video":
        await downloadVideo(folder, video || "")
        break;
      case "image":
        await downloadImage(folder, image || "")
        break;
      case "length":
        await getLength(folder)
        break;

      case "thumb":
        await renderThumbnail(folder)
        break;
      case "rem":
        await render(folder)
        break;
      case "remtik":
        await render(folder, true)
        break;
      case "ec2":
        await ec(folder, false)
        break;
      case "ec2stop":
        await ec2Stop()
        break;
      case "ec2start":
        await ec2Start()
        break;

      case "lamthumb":
        await lambdaThumbnail(folder)
        break;
      case "lam":
        await lambda(folder, false)
        break;
      case "lamtik":
        await lambda(folder, true)
        break;

      case "up":
        await post(folder)
        break;
      case "uptik":
        await post(folder, true)
        break;
      default:
        console.log(`${program} is not a valid program`)
    }
  }
  console.log(`Finished ${folder}`)
}

#!/usr/bin/env node
import 'dotenv/config'
import { post } from './upload/index.js'
import reddit from './reddit/index.js'
import { downloadImage, downloadVideo } from './pixabay/index.js'
import { render, renderThumbnail } from './remotion/render.js'
import { lambda, lambdaThumbnail } from './remotion/lambda.js'
import { getLength } from './file/index.js'
import { startToSpeech } from './amazon/index.js'
import { ec, ec2Start, ec2Stop } from './amazon/ec2.js'

export const getParams = () => process.argv[3]
export const getProgram = () => process.argv[2] === "all" ? ["reddit", "tts", "video", "image", "lamthumb", "lam", "up", "lamtik", "uptik"] :
  process.argv[2] === "prepare" ? ["reddit", "tts", "video", "image"] :
    process.argv[2] === "youtube" ? ["thumb", "rem", "up"] :
      process.argv[2] === "tiktok" ? ["reddit", "tts", "video", "image", "remtik", "uptik"] :
        process.argv[2] === "tiktoklocal" ? ["reddit", "tts", "video", "image", "remtik", "uptik"] :
          process.argv[2].split(",")

export default async function main() {
  const programs = getProgram()
  console.log(`Starting ${programs} `)
  if (programs.includes("ec2")) ec2Start()
  for (let i = 3; i < process.argv.length; i++) {
    const props = process.argv[i].split(",")
    const folder = props[0]
    const video = props[2]
    const image = props[1]
    console.log(folder, video, image)

    for (const program of programs) {
      switch (program) {
        case "reddit":
          await reddit(folder)
          break;
        case "tts":
          await startToSpeech(folder)
          break;

        case "video":
          await downloadVideo(folder, video)
          break;
        case "image":
          await downloadImage(folder, image)
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
    if (programs.includes("ec2")) ec2Stop()
    console.log(`Finished ${folder}`)
  }
}
main()

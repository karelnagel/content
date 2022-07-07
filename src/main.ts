#!/usr/bin/env node
import 'dotenv/config'
import { post } from './upload/index.js'
import { readJson, writeJson } from './file/index.js'
import { RedditToSpeech } from './google/index.js'
import reddit from './reddit/index.js'
import render from './remotion/render.js'
import { config } from './config.js'

export const getFolder = () => process.argv[3]
export const getProgram = () => process.argv[2] === "all" ? "reddit,tts,remotion,upload" : process.argv[2]

export default async function main() {
  let folder = getFolder()
  const program = getProgram()

  if (!program.includes("all") && !program.includes("reddit") && !program.includes("tts") && !program.includes("remotion") && !program.includes("upload")) {
    console.error("Invalid program")
    return
  }

  console.log(`Starting ${program} with folder: ${folder}`)

  if (program.includes("reddit")) {
    const threads = await reddit(folder)
    folder = threads[0]
  }

  if (program.includes("tts")) {
    const script = await readJson(folder)
    const post = script.scenes[1].reddit
    if (post) {
      script.scenes[1].reddit = await RedditToSpeech(post, folder)
      await writeJson(script, folder, config.reddit.json)
    }
  }

  if (program.includes("remotion")) {
    await render(folder)
  }

  if (program.includes("upload")) {
    const script = await readJson(folder)
    const result = await post(folder, script.title, script.title, config.upload.platforms)
    if (!result) return console.error("Failed to upload")
    else console.log(result)
  }

  console.log('Success')
}
main()

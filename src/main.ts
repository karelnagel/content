#!/usr/bin/env node
import 'dotenv/config'
import { post } from './ayrshare/index.js'
import { readJson, writeJson } from './file/index.js'
import { RedditToSpeech } from './google/index.js'
import { Script } from './interfaces/index.js'
import reddit from './reddit/index.js'
import render from './remotion/render.js'

export const getFolder = () => process.argv[3]
export const getProgram = () => process.argv[2] || "all" as "all" | "reddit" | "tts" | "remotion" | "youtube"

const subreddit = "AskReddit"
export default async function main() {
  const folder = getFolder() || new Date().toISOString()
  const program = getProgram()

  if (program !== "all" && program !== "reddit" && program !== "tts" && program !== "remotion" && program !== "youtube") {
    console.error("Invalid program")
    return
  }

  console.log(`Starting ${program} with folder: ${folder}`)

  if (program === "all" || program === "reddit") {
    const thread = await reddit(subreddit, 2, 10, "top")
    const script: Script = {
      folder,
      title: thread.title || `r/${thread.subreddit}`,
      scenes: [{ type: "intro" }, { type: "reddit", reddit: thread }, { type: "outro" }]
    }
    await writeJson(script, `videos/${folder}`, "script.json")
  }

  if (program === "all" || program === "tts") {
    const script = await readJson(folder)
    const post = script.scenes[1].reddit
    if (post) await RedditToSpeech(post, folder)
  }

  if (program === "all" || program === "remotion") {
    await render(folder)
  }

  if (program === "all" || program === "youtube") {
    const result = await post(folder, "This is description", "This is title", ["youtube", "linkedin"])
    if (!result) return console.error("Failed to upload to youtube")
    else console.log(result)
  }

  console.log('Success')
}
main()

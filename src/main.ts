#!/usr/bin/env node
import 'dotenv/config'
import { oneThread } from './oneThread.js'

export const getParams = () => process.argv[3]
export const getProgram = () => process.argv[2] === "all" ? ["reddit", "tts", "video", "image", "lamthumb", "lam", "up", "lamtik", "uptik"] :
  process.argv[2] === "prepare" ? ["reddit", "tts", "video", "image"] :
    process.argv[2] === "youtube" ? ["thumb", "rem", "up"] :
      process.argv[2] === "tiktok" ? ["reddit", "tts", "video", "image", "remtik", "uptik"] :
        process.argv[2] === "tiktoklam" ? ["reddit", "tts", "video", "image", "lamtik", "uptik"] :
          process.argv[2].split(",")

export default async function main() {
  const programs = getProgram()
  console.log(`Starting ${programs} `)
  for (let i = 3; i < process.argv.length; i++) {
    const props = process.argv[i].split(",")
    await oneThread(programs, props[0], props[2], props[1])
  }
}

main()

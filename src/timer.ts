#!/usr/bin/env node
import 'dotenv/config'

import { getQueue, postQueue } from "./file/index.js"
import { oneThread } from "./oneThread.js"

async function timer() {
  while (true) {
    const queue = await getQueue()
    if (queue && queue.length > 0) {
      console.log(`Starting ${queue[0]}`)
      await oneThread(["reddit", "tts", "remtik", "uptik"], queue[0])
      await postQueue(queue.slice(1))
    }
    // else console.log("Queue is empty")
    await new Promise(resolve => setTimeout(resolve, 10000))
  }
}
timer()

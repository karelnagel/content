#!/usr/bin/env node
import 'dotenv/config'
import { createScript } from './openai/index.js'
import { getThreadIds, getThreads } from './twitter/index.js'
import { start } from './render.js'
import { writeJson } from './file/index.js'
import { scriptToSpeech } from './google/index.js'
import config from './conf.js'
import { postTweet, postVideo } from './twitter/post.js'

export default async function main() {
  const folder = new Date().toISOString()
  const folderPath = `${config.folderPath}/${folder}`
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - config.lastDays)
  console.log(`Starting with ${folder}`)

  // Getting thread ids
  const threadIds = await getThreadIds(config.searchTerm, config.threadsCount, yesterday.toISOString())
  if (!threadIds || threadIds.length === 0) {
    console.log('Error with getting thread ids')
    return
  }
  console.log(`Got these thread ids: ${threadIds}`)

  // Getting threads
  const threads = await getThreads(threadIds)
  if (!threads || threads.length === 0) {
    console.log('Error with getting threads')
    return
  }
  console.log(`Got the tweets for ${threads.length} threads`)

  // Creating script
  const { script, title } = await createScript(threads)
  console.log('Script ready')

  // Writing script to file
  const scriptPath = await writeJson({ folder, script, title }, folderPath)
  console.log(`Script written to ${scriptPath}`)

  // Getting audio files
  await scriptToSpeech(script, folderPath)

  // Creating video with remotion
  console.log('Starting rendering...')
  const videoPath = await start(folder, folderPath)
  if (!videoPath) {
    console.log('Error with rendering')
    return
  }
  console.log(`Video created: ${videoPath}`)

  // Posting video to twitter
  console.log('Posting...')
  const tweetId = await postVideo(title.replace('\n', ''), videoPath)
  if (!tweetId) {
    console.log('Error with posting')
    return
  }
  console.log(`Video posted: https://twitter.com/ethnews/status/${tweetId}`)

  console.log('Adding replies...')
  let lastTweet = tweetId
  for await (const id of threadIds) {
    const newTweet = await postTweet({ status: `https://twitter.com/ethnews/status/${id}`, replyTo: lastTweet })
    if (!newTweet) {
      console.log('Error with adding reply')
      continue
    }
    lastTweet = newTweet
  }
  console.log('Success')
}
main()

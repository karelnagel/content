// import textToSpeech from '@google-cloud/text-to-speech'
// import fs from 'fs/promises'
// import { Post } from '../interfaces'
// import { config } from '../config.js'
// import { getAudioDurationInSeconds } from 'get-audio-duration'
// import { makeDirectory, readJson, writeJson } from '../file/index.js'

// const client = new textToSpeech.TextToSpeechClient()

// export async function startToSpeech(folder: string) {
//   const script = await readJson(folder)
//   const post = script.scenes.find(s => s.type === "reddit")?.reddit
//   if (post) {
//     script.scenes.find(s => s.type === "reddit")!.reddit = await RedditToSpeech(post, folder)
//     await writeJson(script, folder, config.reddit.json)
//   }
// }
// export async function RedditToSpeech(post: Post, folder: string) {
//   const newPost = post
//   await makeDirectory(`./${config.folderPath}/${folder}/audio`)
//   if (newPost.title) newPost.titleDuration = await toSpeech(newPost.title, `./${config.folderPath}/${folder}/audio/${newPost.id}_title.mp3`)
//   if (newPost.body) newPost.bodyDuration = await toSpeech(newPost.body, `./${config.folderPath}/${folder}/audio/${newPost.id}_body.mp3`)
//   if (newPost.replies) {
//     const replies: Post[] = []
//     for (const reply of newPost.replies) {
//       replies.push(await RedditToSpeech(reply, folder))
//     }
//     newPost.replies = replies
//   }
//   return newPost
// }

// export async function toSpeech(text: string, output: string): Promise<number> {
//   const [response] = await client.synthesizeSpeech({
//     input: { text: text },
//     voice: {
//       languageCode: config.tts.lang,
//       ssmlGender: config.tts.gender === 'MALE' ? 'MALE' : 'FEMALE',
//       name: config.tts.name,
//     },
//     audioConfig: { audioEncoding: 'MP3', pitch: config.tts.pitch, speakingRate: config.tts.speakingRate },
//   })

//   if (response.audioContent) {
//     await fs.writeFile(output, response.audioContent, 'binary')
//     console.log(`Audio content written to file: ${output}`)
//     const duration = await getAudioDurationInSeconds(output)
//     return duration
//   } else {
//     console.log('eror')
//     return 0
//   }
// }

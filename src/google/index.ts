import textToSpeech from '@google-cloud/text-to-speech'
import fs from 'fs'
import { Post } from 'src/interfaces'
import util from 'util'
import { config } from '../config.js'

const client = new textToSpeech.TextToSpeechClient()

export async function RedditToSpeech(post: Post, folder: string) {
  if (post.title) await toSpeech(post.title, `./videos/${folder}/${post.id}_title.mp3`)
  if (post.body) await toSpeech(post.body, `./videos/${folder}/${post.id}_body.mp3`)
  if (post.replies) {
    for (const reply of post.replies) {
      await RedditToSpeech(reply, folder)
    }
  }
}

export async function toSpeech(text: string, output: string) {
  const [response] = await client.synthesizeSpeech({
    input: { text: text },
    voice: {
      languageCode: config.tts.lang,
      ssmlGender: config.tts.gender === 'MALE' ? 'MALE' : 'FEMALE',
      name: config.tts.name,
    },
    audioConfig: { audioEncoding: 'MP3', pitch: config.tts.pitch, speakingRate: config.tts.speakingRate },
  })

  if (response.audioContent) {
    const writeFile = util.promisify(fs.writeFile)
    await writeFile(output, response.audioContent, 'binary')
    console.log(`Audio content written to file: ${output}`)
  } else {
    console.log('eror')
  }
}

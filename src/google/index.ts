import textToSpeech from '@google-cloud/text-to-speech'
import fs from 'fs'
import { Script } from 'src/interfaces'
import util from 'util'
import config from './../conf.js'

const client = new textToSpeech.TextToSpeechClient()

export async function scriptToSpeech(script: Script[], folderPath: string) {
  for await (const scriptElement of script) {
    await toSpeech(scriptElement.text, `${folderPath}/${scriptElement.position}.mp3`)
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

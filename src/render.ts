import { exec } from 'child_process'
import config from './conf.js'

export const start = async (folder: string, folderPath: string): Promise<string | null> => {
  const filePath = `${folderPath}/video.mp4`

  return new Promise(resolve => {
    exec(
      `npx remotion render src/remotion/index.tsx ${config.composition} ${filePath}  --props=./videos/${folder}/script.json`,
      async function (err) {
        if (err) {
          console.log(err)
          resolve(null)
        } else {
          resolve(filePath)
        }
      },
    )
  })
}

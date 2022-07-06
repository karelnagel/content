import { exec } from 'child_process'
import config from '../conf.js'

const render = async (folder: string): Promise<string | null> => {
  const filePath = `./videos/${folder}/video.mp4`
  console.log("Remotion started!")

  const idk: string | null = await new Promise(resolve => {
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
  console.log("Remotion finished!")
  return idk
}

export default render

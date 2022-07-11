import fs from 'fs/promises'
import { config } from './../config.js'
import { Post, Script } from './../interfaces'

export async function writeJson(object: Script, folder: string, file = config.reddit.json): Promise<string> {
  const fileName = `./${config.folderPath}/${folder}/${file}`
  await makeDirectory(`./${config.folderPath}/${folder}`)

  await fs.writeFile(fileName, JSON.stringify(object, null, 2),)
  return fileName
}

export async function makeDirectory(folder: string) {
  await fs.mkdir(folder, { recursive: true })
}
export const readJson = async (folder: string, file = config.reddit.json): Promise<Script> => {
  return JSON.parse(await fs.readFile(`./${config.folderPath}/${folder}/${file}`, "utf8"))
}


 const getPostDuration = (post: Post, recursive = true): number => {
  let length = 0
  if (post.titleDuration) {
    length += post.titleDuration
  }
  if (post.bodyDuration) {
    length += post.bodyDuration
  }
  if (post.media?.duration) {
    length += post.media.duration
  }
  if (post.replies && recursive)
    for (const reply of post.replies) {
      length += getPostDuration(reply)
    }
  return length
}
export const getLength = async (folder: string) => {
  const json = await readJson(folder)
  const length = json.scenes[0].reddit ? getPostDuration(json.scenes[0].reddit) : 0
  console.log(`${folder} length: ${length}`)
}

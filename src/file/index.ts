import fs from 'fs/promises'
import { config } from './../config.js'
import { Script } from './../interfaces'

export async function writeJson(object: object, folder: string, file = config.reddit.json): Promise<string> {
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

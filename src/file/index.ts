import fs from 'fs'
import { Script } from 'src/interfaces'

export async function writeJson(object: object, folder: string, file = "script.json"): Promise<string> {
  const fileName = `${folder}/${file}`
  await makeDirectory(folder)

  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, JSON.stringify(object, null, 2), err => {
      if (err) {
        reject(err)
      }
      resolve(fileName)
      return fileName
    })
  })
}

//function to make direcorty based on ipnut and write json object into script.json file
export async function makeDirectory(folder: string) {
  return new Promise((resolve, reject) => {
    fs.mkdir(folder, { recursive: true }, err => {
      if (err) reject(err)
      else resolve(folder)
    })
  })
}
export const readJson = async (folder: string, file = "script.json"): Promise<Script> => {
return JSON.parse(fs.readFileSync(`./videos/${folder}/${file}`, "utf8"))
}

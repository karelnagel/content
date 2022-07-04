import fs from 'fs'
import { ScriptJson } from 'src/interfaces'

export async function writeJson(object: ScriptJson, folder: string): Promise<string> {
  const fileName = `${folder}/script.json`
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

import axios from "axios";
import { readJson, writeJson } from "../file/index.js";

export async function downloadVideo(folder: string, id: string) {
  const script = await readJson(folder)

  const result = await axios.get("https://pixabay.com/api/videos/", { params: { key: process.env.PIXABAY, id } })
  const videos = result.data.hits[0]?.videos
  script.video = videos?.medium?.url || videos?.small?.url || undefined
  await writeJson(script, folder)
}

export async function downloadImage(folder: string, id: string) {
  const script = await readJson(folder)

  const result = await axios.get("https://pixabay.com/api/", { params: { key: process.env.PIXABAY, id } })
  script.image = result.data.hits[0]?.largeImageURL
  await writeJson(script, folder)
}

import axios from "axios";
import { readJson, writeJson } from "../file/index.js";

export async function downloadVideo(folder: string, id: string) {
  const script = await readJson(folder)

  const result = await axios.get("https://pixabay.com/api/videos/", { params: { key: process.env.PIXABAY, id } })
  const data = result.data.hits[0]
  script.video = { url: data?.videos?.medium?.url || data?.videos?.small?.url || undefined, duration: data.duration, id }
  await writeJson(script, folder)
}

export async function downloadImage(folder: string, id: string) {
  const script = await readJson(folder)

  const result = await axios.get("https://pixabay.com/api/", { params: { key: process.env.PIXABAY, id } })
  script.image = { url: result.data.hits[0]?.largeImageURL, id }
  await writeJson(script, folder)
}

import axios from "axios";
import { readJson, writeJson } from "../file/index.js";

const randomVideos = ["64759", "111204", "66810", "81945", "74888", "91744", "110734", "111101", "1700", "21985", "80724", "123409", "121799", "70796", "62249"]
export async function downloadVideo(folder: string, id: string) {
  const script = await readJson(folder)
  const result = await axios.get("https://pixabay.com/api/videos/", { params: { key: process.env.PIXABAY, id: id || randomVideos[Math.round(Math.random() * randomVideos.length - 1)] } })
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

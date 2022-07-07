import axios from "axios"

import fs from 'fs/promises';
const API_KEY = process.env.AYRSHARE; // get an API Key at ayrshare.com
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
}
export const post = async (folder: string, post: string, title: string, platforms = ["youtube"]) => {
  const med = await media(`videos/${folder}/video.mp4`)
  if (!med) return

  const body = { post, platforms, mediaUrls: [med], youTubeOptions: { title, youTubeVisibility: "public" } }
  try {
    const result = await axios.post(`https://app.ayrshare.com/api/post`, body, { headers });
    console.log(result.data)
    return result.data.postIds?.map((post: any) => post.postUrl)
  } catch (e) {
    console.log(e)
  }
};

export const media = async (filePath: string) => {
  const file = await fs.readFile(filePath, { encoding: 'base64' });
  const body = { file: `data:video/mp4;base64,${file}`, fileName: "file.mp4", description: "video" }
  try {
    const result = await axios.post(`https://app.ayrshare.com/api/media/upload`, body, {
      headers
    });
    return result.data.url
  }
  catch (e) { console.log(e) }
};

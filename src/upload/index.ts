import axios from "axios"
import { Storage } from '@google-cloud/storage';
import { config } from "../config.js";

const API_KEY = process.env.AYRSHARE; // get an API Key at ayrshare.com
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
}
const storage = new Storage({ keyFilename: 'google-key.json' });
const bucketName = config.bucketName;

export const post = async (folder: string, post: string, title: string, platforms = ["youtube"], tiktok = false) => {
  const med = await uploadVideo(folder, tiktok ? "tiktok.mp4" : "video.mp4")
  const thumbNail = !tiktok ? await uploadVideo(folder, "thumbnail.png") : ""
  if (!med) return false
  console.log(med, thumbNail)
  const body = {
    post, platforms, mediaUrls: [med],
    isVideo: true,
    youTubeOptions: !tiktok ? { title, youTubeVisibility: "public", thumbNail } : undefined
  }
  try {
    const result = await axios.post(`https://app.ayrshare.com/api/post`, body, {
      headers,
      'maxContentLength': Infinity,
      'maxBodyLength': Infinity
    });

    console.log(result.data)
    return result.data.postIds?.map((post: any) => post.postUrl)
  } catch (e) {
    console.log(JSON.stringify(e, null, 2))
  }
};

const bucketUrl = (folder: string, file: string) => `https://storage.googleapis.com/${bucketName}/${folder}/${file}`

export async function uploadVideo(folder: string, file: string) {
  await storage.bucket(bucketName).upload(`${config.folderPath}/${folder}/${file}`, { destination: `${folder}/${file}` });
  return bucketUrl(folder, file)
}

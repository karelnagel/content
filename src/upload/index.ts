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

export const post = async (folder: string, post: string, title: string, platforms = ["youtube"]) => {
  const med = await uploadVideo(folder)
  const thumbNail = await uploadImage(folder)
  console.log(med, thumbNail)
  if (!med) return false

  const body = { post, platforms, mediaUrls: [med], youTubeOptions: { title, youTubeVisibility: "public", thumbNail }, isVideo: true }
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
export async function uploadVideo(folder: string) {
  const idk = await storage.bucket(bucketName).upload(`videos/${folder}/video.mp4`, { destination: `${folder}.mp4` });
  return idk[1]?.mediaLink
}

export async function uploadImage(folder: string) {
  const idk = await storage.bucket(bucketName).upload(`videos/${folder}/thumbnail.png`, { destination: `${folder}.png` });
  return idk[1]?.mediaLink
}

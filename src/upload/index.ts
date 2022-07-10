import axios from "axios"
import { Storage } from '@google-cloud/storage';
import { config } from "../config.js";
import { readJson } from "../file/index.js";

const API_KEY = process.env.AYRSHARE; // get an API Key at ayrshare.com
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
}
const storage = new Storage({ keyFilename: 'google-key.json' });
const bucketName = config.bucketName;

export const post = async (folder: string, platforms = config.upload.platforms, tiktok = false) => {
  const json = await readJson(folder)
  const med = tiktok ? json.tiktokUpload?.url : json.youtubeUpload?.url
  const thumbNail = tiktok ? json.tiktokUpload?.thumbnail : json.youtubeUpload?.thumbnail
  const post = json.title
  const title = json.title
  if (!med) return false

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

export async function uploadToBucket(folder: string, file: string) {
  await storage.bucket(bucketName).upload(`${config.folderPath}/${folder}/${file}`, { destination: `${folder}/${file}` });
  return bucketUrl(folder, file)
}

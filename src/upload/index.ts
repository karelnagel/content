import axios from "axios"
import { readJson } from "../file/index.js";

const API_KEY = process.env.AYRSHARE; // get an API Key at ayrshare.com
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
}

export const post = async (folder: string, tiktok = false) => {
  const json = await readJson(folder)

  const platforms = tiktok ? ["tiktok", "instagram", "youtube"] : ["youtube"]
  const med = tiktok ? json.tiktokUpload?.url : json.youtubeUpload?.url
  const thumbNail = tiktok ? json.tiktokUpload?.thumbnail : json.youtubeUpload?.thumbnail
  const post = tiktok ? json.title : `${json.title} \nView the thread: https://www.reddit.com/comments/${folder}`
  const title = json.title

  if (!med) return false

  const body = {
    post, platforms, mediaUrls: [med],
    isVideo: true,
    autoHashtag: true,
    shortenLinks: false,
    youTubeOptions: {
      title,
      youTubeVisibility: "public",
      thumbNail, shorts: tiktok
    },
    instagramOptions: {
      reels: tiktok,
      shareReelsFeed: tiktok
    }
  }
  try {
    const result = await axios.post(`https://app.ayrshare.com/api/post`, body, {
      headers,
      'maxContentLength': Infinity,
      'maxBodyLength': Infinity
    });

    console.log(result.data)
    const urls = result.data.postIds?.map((post: any) => post.postUrl)
    console.log(urls)
    return urls
  } catch (e: any) {
    console.log(`Axios error with code ${e.response.status} ${e.response.data}`)
  }
};

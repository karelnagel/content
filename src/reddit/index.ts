import axios from 'axios'
import { config } from '../config.js'
import { postScript } from '../file/index.js'
import { Post, Script } from '../interfaces'
import { getVideoDurationInSeconds } from 'get-video-duration'
import getAudioDurationInSeconds from 'get-audio-duration'

type Sort = "top" | "controversial" | "confidence"

export async function getTopPostIds(subreddit: string, limit: number = 10): Promise<string[]> {
  const result = await axios.get(`https://www.reddit.com/r/${subreddit}/top.json`, { params: { limit: limit } })
  return result.data.data.children.map((post: any) => post.data.id)
}

export async function getThread(threadId: string, depth?: number, limit?: number, sort?: Sort): Promise<Post | undefined> {
  try {
    const result = await axios.get(`https://reddit.com/comments/${threadId}/top.json`, { params: { depth, limit, sort } })
    const jsonPost = result.data[0].data.children[0].data

    const hint = jsonPost.post_hint
    const mediaUrl = jsonPost.media?.reddit_video?.fallback_url || jsonPost.url_overridden_by_dest

    const mediaType: "video" | "image" | "gif" | undefined =
      hint?.includes("video") ? 'video' :
        hint?.includes("image") ? mediaUrl.includes(".gif") ? "gif" : "image" : undefined

    let mediaAudio = mediaType === "video" ? `${mediaUrl.split('DASH')[0]}DASH_audio.mp4` : undefined
    if (mediaAudio) try { await getAudioDurationInSeconds(mediaAudio) } catch (e) { mediaAudio = undefined }
    const media = mediaUrl && mediaType ? {
      src: mediaUrl,
      audio: mediaAudio,
      type: mediaType,
      duration: mediaType.includes("video") ? await getVideoDurationInSeconds(mediaUrl) : 3
    } : undefined

    const post: Post = { id: jsonPost.id, subreddit: { name: jsonPost.subreddit, image: await getRedditImage(jsonPost.subreddit, true) }, title: { text: removeLinks(jsonPost.title) }, author: { name: jsonPost.author, image: await getRedditImage(jsonPost.author) }, created_utc: jsonPost.created_utc, score: jsonPost.score, media }

    post.replies = await getReplies(result.data[1].data.children)

    return post
  }
  catch (e) {
    console.log(e)
    return undefined
  }
}
async function getReplies(jsonReplies: any): Promise<Post[]> {
  const returnReplies: Post[] = []
  for (const reply of jsonReplies) {
    const jsonReply = reply.data
    if (!jsonReply.author || jsonReply.distinguished === "moderator") continue;

    const replies = reply.data?.replies?.data?.children ? await getReplies(reply.data.replies.data.children) : []
    const replyPost: Post = { id: jsonReply.id, body: { text: removeLinks(jsonReply.body) }, author: { name: jsonReply.author, image: await getRedditImage(jsonReply.author) }, created_utc: jsonReply.created_utc, score: jsonReply.score, replies }
    returnReplies.push(replyPost)
  }
  return returnReplies
}

export default async function reddit(folder: string) {
  console.log("Starting reddit!")
  const thread = await getThread(folder, config.reddit.depth, config.reddit.limit, config.reddit.sort as Sort)
  if (!thread) {
    console.log("error gettting thread")
    return
  }
  const script: Script = {
    id: folder,
    title: `${thread.title?.text} (r/${thread.subreddit?.name}) #reddit #redditstories #${thread.subreddit?.name}`,
    scenes: [{ type: "reddit", reddit: thread }]
  }
  await postScript(script)
  console.log("Reddit finished!")
  return folder
}
export async function getRedditImage(name: string, subreddit = false) {
  try {
    const result = await axios.get(`https://www.reddit.com/${subreddit ? "r" : "user"}/${name}/about.json`)
    const img = result.data?.data?.icon_img?.replace(/&amp;/g, "&")
    return img
  }
  catch {
    return undefined
  }
}

export function removeLinks(str: string) {
  if (!str) return str
  const tags = str.match(/\[.*?(?=\]\((.*?)\))/g)?.map(x => x.substring(1)) ?? [];
  const newString = str.replace(/\[.*?\]\(.*?\)/g, () => tags.shift() ?? "")
    .replace(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

  return newString
}

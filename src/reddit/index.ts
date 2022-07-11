import axios from 'axios'
import { config } from '../config.js'
import { writeJson } from '../file/index.js'
import { Post, Script } from '../interfaces'
import { getVideoDurationInSeconds } from 'get-video-duration'

type Sort = "top" | "controversial" | "confidence"

export async function getTopPostIds(subreddit: string, limit: number = 10): Promise<string[]> {
  const result = await axios.get(`https://www.reddit.com/r/${subreddit}/top.json`, { params: { limit: limit } })
  return result.data.data.children.map((post: any) => post.data.id)
}

export async function getThread(threadId: string, depth?: number, limit?: number, sort?: Sort): Promise<Post> {
  const result = await axios.get(`https://reddit.com/comments/${threadId}/top.json`, { params: { depth, limit, sort } })
  const jsonPost = result.data[0].data.children[0].data

  const hint = jsonPost.post_hint
  const mediaUrl = jsonPost.media?.reddit_video?.fallback_url || jsonPost.url_overridden_by_dest
  const mediaType: "video" | "image" | "gif" | undefined = hint?.includes("video") ? 'video' : hint?.includes("image") ? mediaUrl.includes(".gif") ? "gif" : "image" : undefined
  const media = mediaUrl && mediaType ? {
    src: mediaUrl,
    type: mediaType,
    duration: mediaType === "video" ? await getVideoDurationInSeconds(mediaUrl) : 3
  } : undefined

  const post: Post = { id: jsonPost.id, subreddit: { name: jsonPost.subreddit, image: await getRedditImage(jsonPost.subreddit, true) }, body: removeLinks(jsonPost.body), title: removeLinks(jsonPost.title), author: { name: jsonPost.author, image: await getRedditImage(jsonPost.author) }, created_utc: jsonPost.created_utc, score: jsonPost.score, media }

  post.replies = await getReplies(result.data[1].data.children)

  return post
}
async function getReplies(jsonReplies: any): Promise<Post[]> {
  const returnReplies: Post[] = []
  for (const reply of jsonReplies) {
    const jsonReply = reply.data
    if (!jsonReply.author || jsonReply.distinguished==="moderator") continue;

    const replies = reply.data?.replies?.data?.children ? await getReplies(reply.data.replies.data.children) : []
    const replyPost: Post = { id: jsonReply.id, body: removeLinks(jsonReply.body), title: removeLinks(jsonReply.title), author: { name: jsonReply.author, image: await getRedditImage(jsonReply.author) }, created_utc: jsonReply.created_utc, score: jsonReply.score, replies }
    returnReplies.push(replyPost)
  }
  return returnReplies
}

export default async function reddit(folder: string) {
  console.log("Starting reddit!")
  const thread = await getThread(folder, config.reddit.depth, config.reddit.limit, config.reddit.sort as Sort)
  const script: Script = {
    folder,
    title: `${thread.title} (r/${thread.subreddit?.name})`,
    scenes: [{ type: "reddit", reddit: thread }, { type: "outro" }]
  }
  await writeJson(script, folder)
  console.log("Reddit finished!")
  return folder
}
export async function getRedditImage(name: string, subreddit = false) {
  const result = !subreddit ?
    await axios.get(`https://www.reddit.com/user/${name}/about.json`) :
    await axios.get(`https://www.reddit.com/r/${name}/about.json`)
  const img = result.data.data.icon_img.replace(/&amp;/g, "&")
  return img
}

export function removeLinks(str: string) {
  if (!str) return str
  const tags = str.match(/\[.*?(?=\]\((.*?)\))/g)?.map(x => x.substring(1)) ?? [];
  const newString = str.replace(/\[.*?\]\(.*?\)/g, () => tags.shift() ?? "");

  return newString
}

import axios from 'axios'
import { config } from '../config.js'
import { writeJson } from '../file/index.js'
import { Post, Script } from '../interfaces'


type Sort = "top" | "controversial" | "confidence"

export async function getTopPostIds(subreddit: string, limit: number = 10): Promise<string[]> {
  const result = await axios.get(`https://www.reddit.com/r/${subreddit}/top.json`, { params: { limit: limit } })
  return result.data.data.children.map((post: any) => post.data.id)
}

export async function getThread(threadId: string, depth?: number, limit?: number, sort?: Sort): Promise<Post> {
  const result = await axios.get(`https://reddit.com/comments/${threadId}/top.json`, { params: { depth, limit, sort } })

  const jsonPost = result.data[0].data.children[0].data
  const post: Post = { id: jsonPost.id, subreddit: jsonPost.subreddit, body: jsonPost.body, title: jsonPost.title, author: { name: jsonPost.author }, created_utc: jsonPost.created_utc, score: jsonPost.score }

  post.replies = await getReplies(result.data[1].data.children)

  return post
}
async function getReplies(jsonReplies: any): Promise<Post[]> {
  const returnReplies: Post[] = []
  for (const reply of jsonReplies) {
    const jsonReply = reply.data
    if (!jsonReply.author) continue;

    const replies = reply.data?.replies?.data?.children ? await getReplies(reply.data.replies.data.children) : []
    const replyPost: Post = { id: jsonReply.id, body: jsonReply.body, title: jsonReply.title, author: { name: jsonReply.author }, created_utc: jsonReply.created_utc, score: jsonReply.score, replies }
    returnReplies.push(replyPost)
  }
  return returnReplies
}

export default async function reddit(folder?: string) {
  console.log("Starting reddit!")
  const posts = folder ? [folder] : await getTopPostIds(config.reddit.subreddit, config.reddit.posts)
  for (const post of posts) {
    const thread = await getThread(post, config.reddit.depth, config.reddit.limit, config.reddit.sort as Sort)
    const script: Script = {
      folder: post,
      title: `${thread.title?.split(/.|!|?/)[0]} (r/${thread.subreddit})`,
      scenes: [{ type: "intro" }, { type: "reddit", reddit: thread }, { type: "outro" }]
    }
    await writeJson(script, post, config.reddit.json)
  }
  console.log("Reddit finished!")
  return posts
}

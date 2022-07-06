import axios from 'axios'
import { Post } from 'src/interfaces'


type Sort = "top" | "controversial" | "confidence"

export async function getTopPosts(subreddit: string, limit: number = 10) {
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

export default async function reddit(subreddit: string, depth?: number, limit?: number, sort?: Sort) {
  console.log("Starting reddit!")
  const posts = await getTopPosts(subreddit)
  const thread = await getThread(posts[2], depth, limit, sort)
  console.log("Reddit finished!")
  return thread
}

import { Post, Scene } from "src/interfaces"
import { getAudioDurationInSeconds } from '@remotion/media-utils'
import { config } from "../config"

const fps = config.remotion.fps
export const getDurations = async (scenes: Scene[], folder: string) => {
  const newScenes: Scene[] = []
  for (const scene of scenes) {
    if (scene.type === 'intro') {
      scene.duration = config.remotion.introDuration * fps
    }
    if (scene.type === 'reddit' && scene.reddit) {
      const { duration, post } = await getRedditDuration(scene.reddit, folder)
      scene.duration = duration
      scene.reddit = post
    }
    if (scene.type === 'outro') {
      scene.duration = config.remotion.outroDuration * fps
    }
    newScenes.push(scene)
  }
  return newScenes
}
export const getRedditDuration = async (
  post: Post,
  folder: string,
  recursive = true,
): Promise<{ duration: number; post: Post }> => {
  let duration = 0
  const newPost = post
  if (newPost.title) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const audio = require(`./../../videos/${folder}/${newPost.id}_title.mp3`)
    newPost.titleDuration = Math.floor((await getAudioDurationInSeconds(audio)) * fps)
    duration += newPost.titleDuration
  }
  if (newPost.body) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const audio = require(`./../../videos/${folder}/${newPost.id}_body.mp3`)
    newPost.bodyDuration = Math.floor((await getAudioDurationInSeconds(audio)) * fps)
    duration += newPost.bodyDuration
  }
  if (newPost.replies && recursive) {
    const replies: Post[] = []
    for (const reply of newPost.replies) {
      const idk = await getRedditDuration(reply, folder)
      replies.push(idk.post)
      duration += idk.duration
    }
    newPost.replies = replies
  }
  return { duration, post: newPost }
}

export const getPostDuration = async (post: Post): Promise<number> => {
  let length = 0
  if (post.titleDuration) {
    length += post.titleDuration
  }
  if (post.bodyDuration) {
    length += post.bodyDuration
  }
  if (post.replies)
    for (const reply of post.replies) {
      length += await getPostDuration(reply)
    }
  return length
}

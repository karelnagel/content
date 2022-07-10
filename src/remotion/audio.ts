import { Post, Scene } from "src/interfaces"
import { config } from "../config"

export const getDurations = (scenes: Scene[]) => {
  return scenes.map((scene) => {
    if (scene.type === 'intro')
      return { ...scene, duration: config.remotion.introDuration }
    else if (scene.type === 'reddit' && scene.reddit) {
      return { ...scene, duration: getPostDuration(scene.reddit) }
    }
    else if (scene.type === 'outro')
      return { ...scene, duration: config.remotion.outroDuration }
    else return scene
  })
}

export const getPostDuration = (post: Post, recursive = true): number => {
  let length = 0
  if (post.titleDuration) {
    length += post.titleDuration
  }
  if (post.bodyDuration) {
    length += post.bodyDuration
  }
  if (post.media?.duration) {
    length += post.media.duration
  }
  if (post.replies && recursive)
    for (const reply of post.replies) {
      length += getPostDuration(reply)
    }
  return length
}

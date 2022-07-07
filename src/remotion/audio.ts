import { Post, Scene } from "src/interfaces"
import { config } from "../config"

export const getDurations = (scenes: Scene[]) => {
  return scenes.map((scene) => {
    if (scene.type === 'intro')
      return { ...scene, duration: config.remotion.introDuration }
    else if (scene.type === 'reddit' && scene.reddit) {
      console.log("asdasdasdasd", getPostDuration(scene.reddit))
      return { ...scene, duration: getPostDuration(scene.reddit) }
    }
    else if (scene.type === 'outro')
      return { ...scene, duration: config.remotion.outroDuration }
    else return scene
  })
}

export const getPostDuration = (post: Post): number => {
  let length = 0
  if (post.titleDuration) {
    console.log("titleDuration", post.titleDuration,post.id)
    length += post.titleDuration
  }
  if (post.bodyDuration) {
    console.log("bodyDuration", post.bodyDuration,post.id)
    length += post.bodyDuration
  }
  if (post.replies)
    for (const reply of post.replies) {
      length += getPostDuration(reply)
    }
  return length
}

import { Post, Scene } from "src/interfaces"
import { config } from "../config"

export const getDurations = (scenes: Scene[], tiktok = false): Scene[] => {
  let newScenes = scenes.map((scene) => {
    if (scene.type === 'intro')
      return { ...scene, duration: config.remotion.introDuration }
    else if (scene.type === 'reddit' && scene.reddit) {
      const post = getPostDuration(scene.reddit, true, tiktok) // Removes also all comments that are too long for tiktok
      return { ...scene, duration: post?.duration, reddit: post?.reddit }
    }
    else if (scene.type === 'outro')
      return { ...scene, duration: config.remotion.outroDuration }
    else return { ...scene, duration: 1 }
  })
  if (tiktok) {
    // remove the posts with lowest score to fit into the tiktok duration
    const findLowestScore = (post: Post): { lowestScore: number, postId: string } => {
      if (post.replies && post.replies.length > 0) {
        let lowestScore = Infinity
        let postId = post.id
        post.replies.forEach(reply => {
          const score = findLowestScore(reply)
          if (score.lowestScore <= lowestScore) {
            lowestScore = score.lowestScore
            postId = score.postId
          }
        })
        return { lowestScore, postId }
      }
      else
        return { lowestScore: post.score ?? 0, postId: post.id }
    };
    const removeItem = (post: Post, postId: string): Post | undefined => {
      if (post.id === postId) {
        return undefined
      }
      if (post.replies) {
        post.replies = post.replies.filter(reply => {
          return removeItem(reply, postId)
        })
      }
      return post
    }
    let duration = newScenes.reduce((acc, scene) => (acc + (scene.duration ?? 0)), 0)
    while (duration > config.remotion.tiktokDuration) {
      console.log(duration)
      newScenes = newScenes.map(scene => {
        if (scene.type !== 'reddit' || !scene.reddit) return scene
        const lowestPostId = findLowestScore(scene.reddit).postId
        console.log(lowestPostId)
        const reddit = removeItem(scene.reddit, lowestPostId)
        const duration = reddit ? getPostDuration(reddit, true, tiktok)?.duration : scene.duration
        return { ...scene, reddit, duration }
      })
      duration = newScenes.reduce((acc, scene) => (acc + (scene.duration ?? 0)), 0)
    }
  }
  return newScenes
}

export const getPostDuration = (reddit: Post, recursive = true, tiktok = false): { duration: number, reddit: Post } | null => {
  let duration = 0
  const replies: Post[] = []
  if (reddit.body?.duration) {
    if (tiktok && reddit.body.duration > config.remotion.tiktokCommentDuration) return null
    duration += reddit.body.duration
  }
  if (reddit.title?.duration) {
    duration += reddit.title.duration
  }
  if (reddit.media?.duration) {
    duration += reddit.media.duration
  }
  if (reddit.replies && recursive)
    for (const reply of reddit.replies) {
      const children = getPostDuration(reply, recursive, tiktok)
      if (children) {
        duration += children.duration
        replies.push(children.reddit)
      }
    }
  return { duration, reddit: { ...reddit, replies } }
}

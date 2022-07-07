
export interface Scene {
  type: 'intro' | 'reddit' | 'outro'
  reddit?: Post,
  duration?: number
}
export interface Script {
  title: string
  folder: string
  scenes: Scene[]
}

export interface User {
  name: string,
  image?: string,
}

export interface Post {
  id: string,
  author?: User,
  subreddit?: string,
  title?: string,
  body?: string,
  replies?: Post[],
  created_utc?: number,
  score?: number,
  bodyDuration?: number,
  titleDuration?: number
}

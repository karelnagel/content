
export interface Scene {
  type: 'intro' | 'reddit' | 'outro'
  reddit?: Post,
  duration?: number
}
export interface Script {
  tiktok?: boolean
  title: string
  folder: string
  video?: { url: string, duration: number }
  image?: string
  scenes: Scene[]
  youtubeUpload?: Upload,
  tiktokUpload?: Upload

}
export interface Upload {
  url?: string,
  thumbnail?: string,
}
export interface User {
  name: string,
  image?: string,
}

export interface Post {
  id: string,
  author?: User,
  subreddit?: {
    name: string,
    image?: string
  }
  title?: string,
  body?: string,
  replies?: Post[],
  created_utc?: number,
  score?: number,
  bodyDuration?: number,
  titleDuration?: number
  media?: {
    src: string,
    type?: 'video' | 'image' | 'gif',
    duration: number
  }
}

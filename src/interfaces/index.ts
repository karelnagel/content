
export interface Scene {
  type: 'intro' | 'reddit' | 'outro'
  reddit?: Post,
  duration?: number
}
export interface Script {
  tiktok?: boolean
  title: string
  id: string
  video?: {id:string, url: string, duration: number }
  image?: {id:string, url: string }
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
  title?: Text
  body?: Text
  replies?: Post[],
  created_utc?: number,
  score?: number,
  media?: {
    src: string,
    type?: 'video' | 'videoNoAudio' | 'image' | 'gif',
    duration: number
  }
}
export interface Text {
  text: string,
  url?: string,
  duration?: number
}

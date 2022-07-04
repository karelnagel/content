export interface Tweet {
  id: string
  replyTo?: string
  likes: number
  text: string
  name: string
  username: string
  description: string
  image: string
}

export interface Script {
  type: 'intro' | 'thread' | 'ad' | 'outro'
  text: string
  position: number
  content: {
    type: 'thread' | 'intro' | 'url' | 'outro'
    thread: Tweet[] | null
  }
}
export interface ScriptJson {
  script: Script[]
  folder: string
  title: string
}

export const config = {
  table: 'videos',
  video: "video.mp4",
  thumbnail: "thumbnail.png",
  bucketName: "content_bucket32",
  reddit: {
    subreddit: 'AskReddit',
    limit: 18,
    depth: 4,
    sort: 'top',
    posts: 1,
  },
  remotion: {
    composition: "Video",
    still: "Thumbnail",
    fps: 30,
    width: 1920,
    height: 1080,
    introDuration: 2,
    outroDuration: 2,
    tiktokCommentDuration: 15,
    tiktokDuration: 60
  },
  gpt: {
    model: 'text-davinci-002', // ['text-ada-001','text-curie-001','text-babbage-001','text-davinci-002'],
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
  tts: {
    lang: 'en-US',
    name: 'en-US-Wavenet-D',
    pitch: 0,
    speakingRate: 1,
    gender: 'MALE',
  },
  upload: {
    platforms: ["youtube"]
  }
}
//yarn start all vtbyxd 91744 19247 & yarn start all vtlmtv 110734 7151639 & yarn start all vtukcw 88738 3774381

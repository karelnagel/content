
export const config = {
  folderPath: 'videos',
  reddit: {
    subreddit: 'AskReddit',
    limit: 10,
    depth: 2,
    sort: 'top',
    posts: 2,
    json: "script.json"
  },
  remotion: {
    composition: "Video",
    fps: 30,
    width: 1920,
    height: 1080,
    introDuration: 2,
    outroDuration: 2
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
  upload:{
    platforms:["youtube"]
  }
}

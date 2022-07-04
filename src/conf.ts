/* eslint-env node */

const config = {
  lastDays: 1,
  threadsCount: 4,
  searchTerm: '(@TheDailyETH) -from:TheDailyETH',
  folderPath: 'videos',
  composition: 'Video',
  uploadDelay: 30000,
  status: 'Todays news:',
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
}
export default config

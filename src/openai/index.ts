import { Configuration, OpenAIApi } from 'openai'
import { Script, Tweet } from 'src/interfaces'

import config from './../conf.js'

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
)

const mainContext = 'You are the news reporter for The Daily ETH, which is a news outlet for Ethereum news.'

export async function createScript(threads: Tweet[][]): Promise<{ script: Script[]; title: string }> {
  const summaries = await summarizeThreads(threads)
  console.log('Threads summarized')

  // const intro = await introduction(summaries)
  // console.log('Intro created')
  const names: string[] = []
  new Set(threads.flat(2).map(t => t.name)).forEach(n => names.push(n))
  const intro = `Welcome back to The Daily ETH, today we have tweets from ${names
    .slice(0, names.length - 1)
    .join(', ')} and ${names[names.length - 1]}.`

  // const title = await getTitle(intro, summaries)
  // console.log('Outro created')
  const title = config.status

  const script: Script[] = []
  script.push({
    type: 'intro',
    text: intro,
    position: 0,
    content: {
      type: 'intro',
      thread: null,
    },
  })

  threads.forEach((thread, index) => {
    script.push({
      type: 'thread',
      text: summaries[index],
      position: index + 1,
      content: {
        type: 'thread',
        thread: thread,
      },
    })
  })
  script.push({
    type: 'outro',
    text: "That's it for today, come back tomorrow for the latest Ethereum news!",
    position: threads.length + 1,
    content: {
      type: 'outro',
      thread: null,
    },
  })
  return { script, title }
}
export async function summarizeThreads(threads: Tweet[][]): Promise<string[]> {
  const summaries: string[] = []
  const context = `${mainContext}  You have to write short summary about the previous Twitter thread for a video transcript.`
  for await (const thread of threads) {
    const formattedThread = thread
      .map(tweet => `${tweet.name} (${tweet.username}): ${tweet.text.replace('\n', ' ')}`)
      .join('\n')
    summaries.push(await gpt3(`${formattedThread} \n\n ${context}`))
  }
  return summaries
}

export async function introduction(content: string[]): Promise<string> {
  const context = `${mainContext}  Today is ${new Date().toUTCString()} and you have to write short, 2 sentences long, introduction for the previous content.`
  const introduction = await gpt3(`${content.join('\n')} \n\n ${context} `)
  return introduction
}

export async function getTitle(intro: string, content: string[]): Promise<string> {
  const context = `${mainContext}  You have to write 1 sentence long title for the previous content.`
  const introduction = await gpt3(`${intro} \n ${content.join('\n')} \n\n ${context}`)
  return introduction
}

export async function gpt3(
  prompt: string,
  temperature = config.gpt.temperature,
  max_tokens = config.gpt.max_tokens,
  top_p = config.gpt.top_p,
  frequency_penalty = config.gpt.frequency_penalty,
  presence_penalty = config.gpt.presence_penalty,
  model = config.gpt.model,
) {
  try {
    const response = await openai.createCompletion({
      model,
      prompt,
      temperature,
      max_tokens,
      top_p,
      frequency_penalty,
      presence_penalty,
    })
    if (response.data.choices) {
      return response.data.choices[0].text ?? ''
    }
  } catch (e) {
    console.log(e)
  }
  return ''
}

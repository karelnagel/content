import { Configuration, OpenAIApi } from 'openai'

import config from './../conf.js'

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
)

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

import { PollyClient, StartSpeechSynthesisTaskCommand, StartSpeechSynthesisTaskCommandInput } from "@aws-sdk/client-polly";
import { readJson, writeJson } from "../file/index.js";
import { Post, Scene } from "../interfaces/index.js";
import { config } from "../config.js";

import { getAudioDurationInSeconds } from 'get-audio-duration'

const region = process.env.LAMBDA_REGION; //e.g. "us-east-1"
const pollyClient = new PollyClient({ region });


export async function startToSpeech(folder: string) {
  const script = await readJson(folder)
  const scenes: Scene[] = []
  for (const scene of script.scenes) {
    if (!scene.reddit) scenes.push(scene)
    else scenes.push({ ...scene, reddit: await RedditToSpeech(scene.reddit, folder) })
  }

  console.log(`Waiting 30 seconds for Polly to finish...`)
  await new Promise(resolve => setTimeout(resolve, 30000))
  console.log(`Polly finished.`)

  const scenesWithDurations: Scene[] = []
  for (const scene of scenes) {
    if (!scene.reddit) scenesWithDurations.push(scene)
    else scenesWithDurations.push({ ...scene, reddit: await getPostDurations(scene.reddit, folder) })
  }

  await writeJson({ ...script, scenes: scenesWithDurations }, folder)
}

export async function RedditToSpeech(post: Post, folder: string) {
  const newPost = post
  if (newPost.title?.text) newPost.title.url = await polly(folder, newPost.title.text)
  if (newPost.body?.text) newPost.body.url = await polly(folder, newPost.body.text)
  if (newPost.replies) {
    const replies: Post[] = []
    for (const reply of newPost.replies) {
      replies.push(await RedditToSpeech(reply, folder))
    }
    newPost.replies = replies
  }
  return newPost
}
export async function getPostDurations(post: Post, folder: string) {
  const newPost = post
  if (newPost.title?.url) newPost.title.duration = Math.ceil(await getAudioDurationInSeconds(newPost.title.url))
  if (newPost.body?.url) newPost.body.duration = Math.ceil(await getAudioDurationInSeconds(newPost.body.url))
  if (newPost.replies) {
    const replies: Post[] = []
    for (const reply of newPost.replies) {
      replies.push(await getPostDurations(reply, folder))
    }
    newPost.replies = replies
  }
  return newPost
}

export const polly = async (folder: string, text: string) => {
  const bucket = process.env.LAMBDA_BUCKET
  const prefix = `${config.folderPath}/${folder}/audio/audio`

  const params: StartSpeechSynthesisTaskCommandInput = {
    OutputFormat: "mp3",
    OutputS3BucketName: bucket,
    Text: text,
    TextType: "text",
    VoiceId: "Matthew",
    SampleRate: "22050",
    OutputS3KeyPrefix: prefix
  };
  try {
    const data = await pollyClient.send(
      new StartSpeechSynthesisTaskCommand(params)
    );
    const url = data.SynthesisTask?.OutputUri
    console.log(url)
    return url;
  } catch (err) {
    console.log("Error putting object", err);
    return undefined
  }
};


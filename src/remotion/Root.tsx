import React, { useEffect, useState } from 'react'
import { Composition, continueRender, delayRender, getInputProps } from 'remotion'
import { Video } from './Video'
import { getAudioDurationInSeconds } from '@remotion/media-utils'
import './style.css'
import { Intro } from './screens/Intro'
import { Post, Scene, Script } from 'src/interfaces'
import { Outro } from './screens/Outro'
import { Reddit } from './screens/Reddit'

export const fps = 30
export const logoDuration = fps * 2
const { scenes, folder } = getInputProps() as Script

const getLength = async (scenes: Scene[], folder: string) => {
  const durations = []
  let length = 0
  for (const scene of scenes) {
    let duration = 0
    if (scene.type === 'intro') {
      duration = logoDuration
    }
    if (scene.type === 'reddit' && scene.reddit) {
      duration = Math.floor((await getRedditLength(scene.reddit, folder)) * fps)
    }
    if (scene.type === 'outro') {
      duration = logoDuration
    }
    length += duration
    durations.push(duration)
  }
  return { length, durations }
}
export const getRedditLength = async (post: Post, folder: string, recursive = true): Promise<number> => {
  let length = 0
  if (post.title) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const audio = require(`./../../videos/${folder}/${post.id}_title.mp3`)
    length += await getAudioDurationInSeconds(audio)
  }
  if (post.body) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const audio = require(`./../../videos/${folder}/${post.id}_body.mp3`)
    length += await getAudioDurationInSeconds(audio)
  }
  if (post.replies && recursive)
    for (const reply of post.replies) {
      length += await getRedditLength(reply, folder)
    }
  return length
}

export const Root: React.FC = () => {
  const [handle] = useState(() => delayRender())
  const [totalDutration, setTotalDuration] = useState(1)
  const [durations, setDurations] = useState<number[]>([])

  useEffect(() => {
    const effect = async () => {
      const { length, durations } = await getLength(scenes, folder)
      setDurations(durations)
      setTotalDuration(length)
      continueRender(handle)
    }
    effect()
  }, [handle])
  return (
    <>
      <Composition
        id={`Video`}
        component={Video}
        durationInFrames={totalDutration}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          scenes,
          durations,
        }}
      />
      <Composition
        id={`Intro`}
        component={Intro}
        durationInFrames={logoDuration}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id={`Outro`}
        component={Outro}
        durationInFrames={logoDuration}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id={`Reddit`}
        component={Reddit}
        durationInFrames={4 * fps}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          post: scenes[2].reddit!,
        }}
      />
    </>
  )
}

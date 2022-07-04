import React from 'react'
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  getInputProps,
  Sequence,
  interpolate,
  Easing,
} from 'remotion'
import { ScriptJson, Tweet } from 'src/interfaces'
import { fps } from '../Root'
import { TweetObj } from './Tweet'

const { script } = getInputProps() as ScriptJson

export const Intro: React.FC<{ audio: string }> = ({ audio }) => {
  const threads = script.filter(s => s.content.thread).map(s => s.content.thread) as Tweet[][]
  const { durationInFrames } = useVideoConfig()
  const duration = Math.floor(durationInFrames / threads.length)
  return (
    <>
      <AbsoluteFill className="  bg-white w-full h-full">
        <h1 className="text-9xl font-bold text-primary z-20 relative my-6 text-center">Todays news:</h1>
        <div className="">
          {threads.map((thread, i) => {
            return (
              <Sequence from={duration * i} durationInFrames={duration} layout="none">
                <Thread thread={thread} />
              </Sequence>
            )
          })}
        </div>
      </AbsoluteFill>
      {audio && <Audio src={audio} />}
    </>
  )
}

export const Thread: React.FC<{ thread: Tweet[] }> = ({ thread }) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, fps], [0, 1], { easing: Easing.ease })
  return (
    <div style={{ opacity }} className="flex flex-col space-y-4 max-w-screen-md mx-auto">
      {thread.map((tweet, i) => (
        <TweetObj tweet={tweet} key={i} />
      ))}
    </div>
  )
}

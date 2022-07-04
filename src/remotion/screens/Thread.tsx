import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, interpolate } from 'remotion'
import { Tweet } from 'src/interfaces'
import { TweetObj } from './Tweet'

export const Thread: React.FC<{
  thread: Tweet[]
  audio: string
}> = ({ thread, audio }) => {
  const frame = useCurrentFrame()

  const { durationInFrames } = useVideoConfig()
  const oneDuration = durationInFrames / thread.length
  const translateY = interpolate(frame, [0, durationInFrames], [0, -90])
  return (
    <>
      <AbsoluteFill className="w-full h-full bg-white">
        <div style={{ transform: 'translateY(30%)' }} className="h-full w-full">
          <div
            className="flex flex-col space-y-6 max-w-screen-md mx-auto"
            style={{
              transform: `translateY(${translateY}%)`,
            }}
          >
            {thread &&
              thread.map((tweet, i) => {
                const scale = interpolate(
                  frame,
                  [oneDuration * (i - 0.5), oneDuration * i, oneDuration * (i + 0.5)],
                  [1, 1.4, 1],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  },
                )
                return (
                  <TweetObj
                    style={{
                      transform: `scale(${scale})`,
                    }}
                    tweet={tweet}
                  />
                )
              })}
          </div>
        </div>
      </AbsoluteFill>
      {audio && <Audio src={audio} />}
    </>
  )
}

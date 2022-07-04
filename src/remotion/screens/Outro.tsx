import React from 'react'
import { AbsoluteFill, Audio, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion'

export const Outro: React.FC<{ audio: string }> = ({ audio }) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const color = interpolateColors(frame, [0, durationInFrames], ['#ffc107', '#1fb6ff'])
  return (
    <>
      <AbsoluteFill className="flex flex-col w-full h-full justify-center items-center bg-white">
        <h1 className="text-9xl font-bold " style={{ color }}>
          See you tomorrow!
        </h1>
        <h2 className="text-3xl mt-10 font-bold">Submit threads by tagging @TheDailyETH</h2>
      </AbsoluteFill>
      {audio && <Audio src={audio} />}
    </>
  )
}

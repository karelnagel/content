import React from 'react'
import { AbsoluteFill, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { fps } from '../Root'

export const Logo: React.FC = () => {
  const frame = useCurrentFrame()
  const scale = spring({
    fps,
    frame,
    config: {
      mass: 3,
    },
  })

  const { durationInFrames } = useVideoConfig()
  const color = interpolateColors(frame, [0, durationInFrames], ['#ffc107', '#1fb6ff'])
  return (
    <AbsoluteFill className="flex flex-col justify-center items-center">
      <h1 className="text-9xl font-bold" style={{ transform: `scale(${scale})`, color }}>
        The Daily ETH
      </h1>
    </AbsoluteFill>
  )
}

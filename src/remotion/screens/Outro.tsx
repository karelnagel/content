import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { AiFillYoutube } from 'react-icons/ai'
export const Outro: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const opacity = interpolate(frame, [0,20, 40], [0,0, 1], {
    extrapolateRight: 'clamp',
  })
  const scale = spring({
    fps,
    from: 0,
    to: 1,
    frame,
  })

  return (
    <>
      <AbsoluteFill className="flex flex-col w-full h-full justify-around items-center bg-white text-8xl py-72 font-thumbnail bg-gradient-to-tr to-blue-500 from-green-400 text-white">
        <h1 className="">Longer Video On: </h1>
        <div className="flex items-center flex-col" style={{ transform: `scale(${scale})` }}>
          <AiFillYoutube className="text-red-500 text-2huge" />
          <h2 className="font-bold text-huge ">Elom Musd</h2>
        </div>
        <p className="text-6xl" style={{ opacity }}>
          Link in bio
        </p>
      </AbsoluteFill>
    </>
  )
}

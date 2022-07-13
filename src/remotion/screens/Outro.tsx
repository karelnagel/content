import React from 'react'
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { AiFillYoutube } from 'react-icons/ai'
export const Outro: React.FC<{ image?: { url: string; id: string } }> = ({ image }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const opacity = interpolate(frame, [0, 20, 40], [0, 0, 1], {
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
      <AbsoluteFill className="bg-black">
        <div className="relative h-full max-w-5xl ml-auto">
          <div className=" absolute h-full w-full max-w-2xl bg-gradient-to-r from-black to-transparent"></div>
          {image?.url && <Img src={image.url} className="object-cover h-full w-full border-0" />}
        </div>
      </AbsoluteFill>
      <AbsoluteFill className="flex flex-col w-full h-full justify-around items-center text-8xl py-72 font-thumbnail text-white">
        <h1 className="">Longer Video On: </h1>
        <div className="flex items-center flex-col mb-20 mt-10" style={{ transform: `scale(${scale})` }}>
          <AiFillYoutube className="text-red-500 text-2huge" />
          <h2 className="font-extrabold text-huge ">Elom Musd</h2>
        </div>
        <p className="text-6xl" style={{ opacity }}>
          Link in bio
        </p>
      </AbsoluteFill>
    </>
  )
}

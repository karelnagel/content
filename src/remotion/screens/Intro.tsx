import React from 'react'
import { AbsoluteFill, Img } from 'remotion'

export const Intro: React.FC<{ image?: { url: string; id: string } }> = ({ image }) => {
  return (
    <>
      <AbsoluteFill className="bg-white">
        <Img src={image?.url} />
      </AbsoluteFill>
      <AbsoluteFill className="  ">
        <div className="flex flex-col justify-center items-center text-9xl h-full font-bold text-white">
          <h1>Intro</h1>
        </div>
      </AbsoluteFill>
    </>
  )
}

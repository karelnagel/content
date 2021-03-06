import React from 'react'
import { AbsoluteFill, Img } from 'remotion'
import { Scene } from 'src/interfaces'

export const Thumbnail: React.FC<{ image?: { url: string; id: string }; scenes: Scene[] }> = ({ image, scenes }) => {
  const post = scenes.find(s => s.type === 'reddit')?.reddit
  return (
    <>
      {post && (
        <div>
          <AbsoluteFill className="bg-black">
            <div className="relative h-full max-w-5xl ml-auto">
              <div className=" absolute h-full w-full max-w-2xl bg-gradient-to-r from-black to-transparent"></div>
              {image?.url && <Img src={image.url} className="object-cover h-full w-full border-0" />}
            </div>
          </AbsoluteFill>
          <AbsoluteFill className=" flex h-full font-extrabold text-white p-10 font-thumbnail">
            <div className="h-full max-w-7xl flex flex-col ">
              <h3 className="text-6xl">
                r/<span className="text-blue-500">{post.subreddit?.name}</span>
              </h3>
              <h1 className="m-auto text-9xl leading-tight font-black">{post.title?.text}</h1>
            </div>
          </AbsoluteFill>
        </div>
      )}
    </>
  )
}

import React, { useEffect, useState } from 'react'
import { AbsoluteFill, continueRender, delayRender, getInputProps, Series, Audio, Img } from 'remotion'
import { Post, Script } from 'src/interfaces'

import { fps, getRedditLength } from '../Root'
const { folder } = getInputProps() as Script

const image =
  'https://external-preview.redd.it/_o7PutALILIg2poC9ed67vHQ68Cxx67UT6q7CFAhCs4.png?auto=webp&s=2560c01cc455c9dcbad0d869116c938060e43212'
export const Reddit: React.FC<{ post: Post }> = ({ post }) => {
  const [handle] = useState(() => delayRender())

  const [durations, setDurations] = useState<number[]>([])
  useEffect(() => {
    const effect = async () => {
      const durs: number[] = []
      durs.push(Math.floor((await getRedditLength(post, folder, false)) * fps))
      if (post.replies)
        for (const reply of post.replies) {
          durs.push(Math.floor((await getRedditLength(reply, folder)) * fps))
        }
      setDurations(durs)
      continueRender(handle)
    }
    effect()
  }, [handle])
  return (
    <>
      <AbsoluteFill className="  bg-white w-full h-full ">
        <div className="flex flex-col items-center justify-center max-w-screen-lg m-auto">
          <Series>
            <Series.Sequence durationInFrames={durations[0] ?? 1} layout="none">
              <RedditPost post={post} />
            </Series.Sequence>
            {post.replies &&
              post.replies.map((reply, i) => (
                <Series.Sequence key={i} durationInFrames={durations[i + 1] ?? 1} layout="none">
                  <RedditComment post={reply} />
                </Series.Sequence>
              ))}
          </Series>
        </div>
      </AbsoluteFill>
    </>
  )
}

export const RedditPost: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <>
      <div className="flex">
        <div>{formatNumber(post.score ?? 0)}</div>
        <div>
          <div className="flex space-x-3">
            <Img src={image} className="h-10 w-10 rounded-full" />
            <p className=" font-bold">r/{post.subreddit}</p>
            <p>Posted by u/{post.author?.name}</p>
            <p>{post.created_utc}</p>
          </div>

          <h2 className=" font-bold text-2xl">{post.title}</h2>
        </div>
      </div>
      <Audio src={require(`./../../../videos/${folder}/${post.id}_title.mp3`)} />
    </>
  )
}

export const RedditComment: React.FC<{ post: Post }> = ({ post }) => {
  const [handle] = useState(() => delayRender())

  const [durations, setDurations] = useState<number[]>([])
  useEffect(() => {
    const effect = async () => {
      const durs: number[] = []
      durs.push(Math.floor((await getRedditLength(post, folder, false)) * fps))
      if (post.replies)
        for (const reply of post.replies) {
          durs.push(Math.floor((await getRedditLength(reply, folder)) * fps))
        }
      setDurations(durs)
      continueRender(handle)
    }
    effect()
  }, [handle])
  return (
    <>
      <Comment post={post} />
      <Series>
        {post.replies &&
          post.replies.map((reply, i) => (
            <Series.Sequence layout="none" durationInFrames={durations[i + 1] ?? 1} key={i} offset={durations[0]}>
              <Comment post={reply} />
              <Audio src={require(`./../../../videos/${folder}/${reply.id}_body.mp3`)} />
            </Series.Sequence>
          ))}
      </Series>
      <Audio src={require(`./../../../videos/${folder}/${post.id}_body.mp3`)} />
    </>
  )
}
export function Comment({ post }: { post: Post }) {
  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center space-x-3">
        <Img src={image} className="h-12 w-12 rounded-full" />
        <p className="text-sm font-bold">{post.author?.name}</p>
      </div>
      <p>{post.body}</p>
      <p className=" font-bold">{formatNumber(post.score ?? 0)}</p>
    </div>
  )
}

//function to format number to thousands and millions
export function formatNumber(num: number) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num
}

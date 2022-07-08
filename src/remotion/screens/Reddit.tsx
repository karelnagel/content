import React, { useEffect, useState } from 'react'
import { AbsoluteFill, getInputProps, Series, Audio, Img, Video, Loop, continueRender, delayRender } from 'remotion'
import { Post, Script } from 'src/interfaces'
import { getPostDuration } from '../audio'
import { secondsToFrames } from '../Root'
import { getVideoMetadata } from '@remotion/media-utils'
import { ImArrowUp, ImArrowDown } from 'react-icons/im'

const { folder } = getInputProps() as Script

const image =
  'https://external-preview.redd.it/_o7PutALILIg2poC9ed67vHQ68Cxx67UT6q7CFAhCs4.png?auto=webp&s=2560c01cc455c9dcbad0d869116c938060e43212'
export const Reddit: React.FC<{ post?: Post; video?: string }> = ({ post, video }) => {
  const [videoDuration, setVideoDuration] = useState(1)
  const [handle] = useState(() => delayRender())
  useEffect(() => {
    async function effect() {
      if (video) {
        const data = await getVideoMetadata(video)
        setVideoDuration(data.durationInSeconds)
      }
      continueRender(handle)
    }
    effect()
  }, [])

  return (
    <>
      <AbsoluteFill className="bg-white">
        {video && (
          <Loop durationInFrames={secondsToFrames(videoDuration)}>
            <Video src={video} volume={0} />
          </Loop>
        )}
      </AbsoluteFill>
      <AbsoluteFill className="">
        {post && (
          <div className="flex flex-col max-w-screen-lg mx-auto pt-72 w-full">
            <Series>
              <Series.Sequence durationInFrames={secondsToFrames(post.titleDuration)} layout="none">
                <RedditPost post={post} />
              </Series.Sequence>
              {post.replies &&
                post.replies.map((reply, i) => (
                  <Series.Sequence key={i} durationInFrames={secondsToFrames(getPostDuration(reply))} layout="none">
                    <RedditComment post={reply} />
                  </Series.Sequence>
                ))}
            </Series>
          </div>
        )}
      </AbsoluteFill>
    </>
  )
}

export const RedditPost: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <>
      <div className="flex bg-white rounded-lg p-4 w-full text-xl space-x-5  min-w-max">
        <div className="flex flex-col items-center space-y-2">
          <ImArrowUp className="text-2xl" />
          <p>{formatNumber(post.score ?? 0)}</p>
          <ImArrowDown className="text-2xl" />
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-3">
            <Img src={image} className="h-8 w-8 rounded-full" />
            <p className=" font-bold">r/{post.subreddit}</p>
            <p>Posted by u/{post.author?.name}</p>
            {/* <p>{post.created_utc}</p> */}
          </div>

          <h2 className=" font-bold text-3xl">{post.title}</h2>
        </div>
      </div>
      <Audio src={require(`./../../../videos/${folder}/${post.id}_title.mp3`)} />
    </>
  )
}

export const RedditComment: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className="flex  w-full justify-stretch">
      <div className="w-7 h-full"></div>
      <div className="flex flex-col w-full items-stretch">
        <div className="flex flex-col bg-white rounded-xl p-4 m-1 shadow-md space-y-2 ">
          <div className="flex items-center space-x-3">
            <Img src={image} className="h-10 w-10 rounded-full" />
            <p className="text-lg font-bold">{post.author?.name}</p>
          </div>
          <p className="text-2xl">{post.body}</p>
          <div className="flex space-x-2 items-center">
            <ImArrowUp className="text-xl" />
            <p className=" font-bold text-lg">{formatNumber(post.score ?? 0)}</p>
            <ImArrowDown className="text-xl" />
          </div>
        </div>
        <Series>
          {post.replies &&
            post.replies.map((reply, i) => (
              <Series.Sequence
                layout="none"
                durationInFrames={secondsToFrames(getPostDuration(reply))}
                key={i}
                offset={secondsToFrames(post.bodyDuration)}
              >
                <RedditComment post={reply} />
              </Series.Sequence>
            ))}
        </Series>
        <Audio src={require(`./../../../videos/${folder}/${post.id}_body.mp3`)} />
      </div>
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

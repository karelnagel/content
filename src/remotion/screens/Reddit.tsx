import React from 'react'
import { AbsoluteFill, Series, Audio, Img, Video, Freeze, random } from 'remotion'
import { Post } from 'src/interfaces'
import { getPostDuration } from '../audio'
import { secondsToFrames } from '../Root'
import { ImArrowUp, ImArrowDown } from 'react-icons/im'
import { Gif } from '@remotion/gif'
// import Background from './../images/background.mp4'
const Background = 'https://remotionlambda-24lixyhuqn.s3.us-east-1.amazonaws.com/background.mp4'
const backgroundLength = 500
const defaultImage =
  'https://external-preview.redd.it/_o7PutALILIg2poC9ed67vHQ68Cxx67UT6q7CFAhCs4.png?auto=webp&s=2560c01cc455c9dcbad0d869116c938060e43212'
export const Reddit: React.FC<{ post?: Post; video?: { url: string; duration: number } }> = ({ post }) => {
  return (
    <>
      <AbsoluteFill className="bg-white">
        <Video
          src={Background}
          muted
          className="object-cover h-full w-full"
          startFrom={Math.floor(random(post?.id || '') * backgroundLength) * 30}
        />
      </AbsoluteFill>
      <AbsoluteFill className="">
        {post && (
          <div className="flex flex-col max-w-screen-lg mx-auto h-full w-full p-4 justify-center">
            <Series>
              <Series.Sequence durationInFrames={secondsToFrames(getPostDuration(post, false)?.duration)} layout="none">
                <RedditPost post={post} />
              </Series.Sequence>
              {post.replies &&
                post.replies.map((reply, i) => (
                  <Series.Sequence
                    key={i}
                    durationInFrames={secondsToFrames(getPostDuration(reply)?.duration)}
                    layout="none"
                  >
                    <div key={i} className="-ml-7">
                      <RedditComment post={reply} />
                    </div>
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
      <div className="flex bg-white rounded-lg p-4 w-full text-2xl space-x-5 max-h-full">
        <div className="flex flex-col items-center space-y-2">
          <ImArrowUp className="text-2xl" />
          <p>{formatNumber(post.score ?? 0)}</p>
          <ImArrowDown className="text-2xl" />
        </div>
        <div className="flex flex-col space-y-2 justify-start ">
          <div className="flex space-x-3">
            <Img src={post.subreddit?.image || defaultImage} className="h-8 w-8 rounded-full" />
            <p className=" font-bold">r/{post.subreddit?.name}</p>
            <p>Posted by u/{post.author?.name}</p>
            {/* <p>{post.created_utc}</p> */}
          </div>

          <h2 className=" font-bold text-4xl">{post.title?.text}</h2>
          {post.media && (
            <div className="h-96" style={{ height: '45rem' }}>
              {post.media?.type === 'image' && <Img src={post.media.src} className="object-contain h-full " />}
              {post.media?.type === 'gif' && (
                <Gif src={post.media.src} fit="contain" style={{ height: '100%', width: '100%' }} />
              )}
              {post.media?.type?.includes('video') && (
                <Series>
                  <Series.Sequence durationInFrames={secondsToFrames(post.title?.duration)} layout="none">
                    <Freeze frame={0}>
                      <Video src={post.media.src} className="object-contain h-full" />
                    </Freeze>
                  </Series.Sequence>
                  <Series.Sequence durationInFrames={secondsToFrames(post.media.duration)} layout="none">
                    <Video src={post.media.src} className="object-contain h-full" />
                    {post.media.audio && <Audio src={post.media.audio} />}
                  </Series.Sequence>
                </Series>
              )}
            </div>
          )}
        </div>
      </div>
      <Audio src={post.title?.url} />
    </>
  )
}

export const RedditComment: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className="flex  w-full justify-stretch ">
      <div className="w-7 h-full"></div>
      <div className="flex flex-col w-full items-stretch">
        <div className="flex flex-col bg-white rounded-xl p-4 m-1 shadow-md space-y-2 ">
          <div className="flex items-center space-x-3">
            <Img src={post.author?.image || defaultImage} className="h-12 w-12 rounded-full" />
            <p className="text-2xl font-bold">{post.author?.name}</p>
          </div>
          <p className="text-3xl">{post.body?.text}</p>
          <div className="flex space-x-2 items-center">
            <ImArrowUp className="text-2xl" />
            <p className=" font-bold text-2xl">{formatNumber(post.score ?? 0)}</p>
            <ImArrowDown className="text-2xl" />
          </div>
        </div>
        <Series>
          {post.replies &&
            post.replies.map((reply, i) => (
              <Series.Sequence
                layout="none"
                durationInFrames={secondsToFrames(getPostDuration(reply)?.duration)}
                key={i}
                offset={i === 0 ? secondsToFrames(post.body?.duration) : 0}
              >
                <RedditComment post={reply} />
              </Series.Sequence>
            ))}
        </Series>
        <Audio src={post.body?.url} />
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

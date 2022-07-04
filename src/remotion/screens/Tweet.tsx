import React from 'react'
import { Img } from 'remotion'
import { Tweet } from 'src/interfaces'

export const TweetObj: React.FC<{ style?: React.CSSProperties; tweet: Tweet }> = ({ style, tweet }) => {
  return (
    <div className="bg-white shadow-lg px-4 py-4 duration-1000 flex items-start space-x-4" style={style}>
      {tweet.image && <Img src={tweet.image} className="rounded-full h-16" />}
      <div className="text-lg">
        <div className="flex space-x-3 text-xl">
          <p className="font-bold  text-xl">{tweet.name}</p>
          <p>@{tweet.username}</p>
        </div>
        <h3 className="">{tweet.text}</h3>
      </div>
    </div>
  )
}

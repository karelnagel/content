import React from 'react'
import { AbsoluteFill, Audio } from 'remotion'

export const Url: React.FC<{
  url: string
  audio: string
}> = ({ audio }) => {
  return (
    <>
      <AbsoluteFill>url</AbsoluteFill>
      {audio && <Audio src={audio} />}
    </>
  )
}

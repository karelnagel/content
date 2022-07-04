import React from 'react'
import { AbsoluteFill, Audio, Sequence } from 'remotion'
import { fps } from '../Root'
import music from './../images/logo.mp3'
import { Logo } from './Logo'

export const LogoScreen: React.FC = () => {
  return (
    <>
      <AbsoluteFill className="flex flex-col justify-center items-center space-y-16 bg-white">
        <Sequence from={fps} layout="none">
          <Logo />
        </Sequence>
      </AbsoluteFill>
      <Sequence from={fps / 2}>
        <Audio src={music} />
      </Sequence>
    </>
  )
}

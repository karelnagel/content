import React from 'react'
import { Series } from 'remotion'
import { Script, Tweet } from 'src/interfaces'
import { logoDuration } from './Root'
import { Intro } from './screens/Intro'
import { LogoScreen } from './screens/LogoScreen'
import { Outro } from './screens/Outro'
import { Thread } from './screens/Thread'

export const Video: React.FC<{
  duration: number[]
  script: Script[]
  audioFiles: string[]
}> = ({ duration, script, audioFiles }) => {
  return (
    <Series>
      <Series.Sequence durationInFrames={logoDuration}>
        <LogoScreen />
      </Series.Sequence>
      {script.map((s, i) => (
        <Series.Sequence key={i} durationInFrames={duration[s.position] ?? 1}>
          {s.content.type === 'thread' && (
            <Thread thread={s.content.thread as Tweet[]} audio={audioFiles[s.position]} />
          )}
          {s.content.type === 'intro' && <Intro audio={audioFiles[s.position]} />}
          {s.content.type === 'outro' && <Outro audio={audioFiles[s.position]} />}
        </Series.Sequence>
      ))}
    </Series>
  )
}

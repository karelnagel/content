import React from 'react'
import { Series } from 'remotion'
import { Scene } from 'src/interfaces'
import { Intro } from './screens/Intro'
import { Outro } from './screens/Outro'
import { Reddit } from './screens/Reddit'

export const Video: React.FC<{
  scenes: Scene[]
  durations: number[]
}> = ({ scenes, durations }) => {
  return (
    <Series>
      {scenes.map((scene, i) => (
        <Series.Sequence key={i} durationInFrames={durations[i] ?? 1}>
          {scene.type === 'intro' && <Intro />}
          {scene.type === 'outro' && <Outro />}
          {scene.type === 'reddit' && <Reddit post={scene.reddit!} />}
        </Series.Sequence>
      ))}
    </Series>
  )
}

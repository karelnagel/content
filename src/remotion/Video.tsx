import React from 'react'
import { Series } from 'remotion'
import { Scene } from 'src/interfaces'
import { Intro } from './screens/Intro'
import { Outro } from './screens/Outro'
import { Reddit } from './screens/Reddit'

export const Video: React.FC<{ newScenes: Scene[] }> = ({ newScenes }) => {
  return (
    <Series>
      {newScenes.map((scene, i) => {
        return (
          <Series.Sequence key={i} durationInFrames={scene.duration ?? 1} layout="none">
            {scene.type === 'intro' && <Intro />}
            {scene.type === 'outro' && <Outro />}
            {scene.type === 'reddit' && <Reddit post={scene.reddit} />}
          </Series.Sequence>
        )
      })}
    </Series>
  )
}

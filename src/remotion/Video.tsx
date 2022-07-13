import React from 'react'
import { Series } from 'remotion'
import { Scene } from 'src/interfaces'
import { secondsToFrames } from './Root'
import { Intro } from './screens/Intro'
import { Outro } from './screens/Outro'
import { Reddit } from './screens/Reddit'

export const Video: React.FC<{
  newScenes: Scene[]
  image?: { url: string; id: string }
  video?: { url: string; duration: number; id: string }
}> = ({ newScenes, image, video }) => {
  return (
    <Series>
      {newScenes.map((scene, i) => {
        return (
          <Series.Sequence key={i} durationInFrames={secondsToFrames(scene.duration)}>
            {scene.type === 'intro' && <Intro image={image} />}
            {scene.type === 'outro' && <Outro image={image} />}
            {scene.type === 'reddit' && <Reddit post={scene.reddit} video={video} />}
          </Series.Sequence>
        )
      })}
    </Series>
  )
}

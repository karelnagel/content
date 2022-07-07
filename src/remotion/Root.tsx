import React from 'react'
import { Composition, getInputProps } from 'remotion'
import { Video } from './Video'
import './style.css'
import { Intro } from './screens/Intro'
import { Script } from 'src/interfaces'
import { Outro } from './screens/Outro'
import { Reddit } from './screens/Reddit'
import { getDurations } from './audio'
import { config } from '../config'

const { scenes } = getInputProps() as Script
const fps = config.remotion.fps
const width = config.remotion.width
const height = config.remotion.height
export const secondsToFrames = (seconds?: number) => (seconds ? Math.floor(fps * seconds) : 1)

export const Root: React.FC = () => {
  const newScenes = getDurations(scenes)
console.log(newScenes)
  return (
    <>
      <Composition
        id={`Video`}
        component={Video}
        durationInFrames={secondsToFrames(newScenes.reduce((acc, scene) => acc + (scene.duration || 1), 0))}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          newScenes,
        }}
      />
      <Composition
        id={`Intro`}
        component={Intro}
        durationInFrames={secondsToFrames(newScenes[0].duration)}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{}}
      />
      <Composition
        id={`Outro`}
        component={Outro}
        durationInFrames={secondsToFrames(newScenes[2].duration)}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{}}
      />
      <Composition
        id={`Reddit`}
        component={Reddit}
        durationInFrames={secondsToFrames(newScenes[1].duration)}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          post: newScenes[1].reddit,
        }}
      />
    </>
  )
}

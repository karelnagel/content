import React from 'react'
import { Composition, getInputProps, Still } from 'remotion'
import { Video } from './Video'
import './style.css'
import { Intro } from './screens/Intro'
import { Script } from 'src/interfaces'
import { Outro } from './screens/Outro'
import { Reddit } from './screens/Reddit'
import { getDurations } from './audio'
import { config } from '../config'
import { Thumbnail } from './screens/Thumbnail'

const { scenes, image } = getInputProps() as Script
const fps = config.remotion.fps
const width = config.remotion.width
const height = config.remotion.height
export const secondsToFrames = (seconds?: number) => (seconds ? Math.floor(fps * seconds) : 1)

export const Root: React.FC = () => {
  const newScenes = getDurations(scenes)
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
        durationInFrames={secondsToFrames(newScenes.find(s=>s.type==="intro")?.duration)}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{}}
      />
      <Composition
        id={`Outro`}
        component={Outro}
        durationInFrames={secondsToFrames(newScenes.find(s=>s.type==="outro")?.duration)}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{}}
      />
      <Composition
        id={`Reddit`}
        component={Reddit}
        durationInFrames={secondsToFrames(newScenes.find(s=>s.type==="reddit")?.duration)}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          post: newScenes.find(s=>s.type==="reddit")?.reddit,
        }}
      />
      <Still id={'Thumbnail'} component={Thumbnail} width={width} height={height} defaultProps={{ image, scenes }} />
    </>
  )
}

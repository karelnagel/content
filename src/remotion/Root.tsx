import React, { useEffect, useState } from 'react'
import { Composition, continueRender, delayRender, getInputProps } from 'remotion'
import { Video } from './Video'
import './style.css'
import { Intro } from './screens/Intro'
import { Scene, Script } from 'src/interfaces'
import { Outro } from './screens/Outro'
import { Reddit } from './screens/Reddit'
import { getDurations } from './audio'
import { config } from '../config'

const { scenes, folder } = getInputProps() as Script
const fps = config.remotion.fps
const width = config.remotion.width
const height = config.remotion.height
export const Root: React.FC = () => {
  const [handle] = useState(() => delayRender())
  const [newScenes, setNewScenes] = useState<Scene[]>([])

  useEffect(() => {
    const effect = async () => {
      const scen = await getDurations(scenes, folder)
      setNewScenes(scen)
      continueRender(handle)
    }
    effect()
  }, [handle])
  console.log(newScenes)
  return (
    <>
      <Composition
        id={`Video`}
        component={Video}
        durationInFrames={newScenes.reduce((acc, scene) => acc + (scene.duration || 1), 0) || 1}
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
        durationInFrames={scenes[0].duration ?? 1}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{}}
      />
      <Composition
        id={`Outro`}
        component={Outro}
        durationInFrames={scenes[2].duration ?? 1}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{}}
      />
      <Composition
        id={`Reddit`}
        component={Reddit}
        durationInFrames={scenes[1].duration ?? 1}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          post: scenes[1].reddit,
        }}
      />
    </>
  )
}

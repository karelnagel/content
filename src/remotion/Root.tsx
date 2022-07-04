import React, { useEffect, useState } from 'react'
import { Composition, continueRender, delayRender, getInputProps } from 'remotion'
import { Video } from './Video'
import { getAudioDurationInSeconds } from '@remotion/media-utils'
import './style.css'
import { Intro } from './screens/Intro'
import { Thread } from './screens/Thread'
import { ScriptJson, Tweet } from 'src/interfaces'
import { LogoScreen } from './screens/LogoScreen'

export const fps = 30
export const logoDuration = fps * 4
const { script, folder } = getInputProps() as ScriptJson

export const Root: React.FC = () => {
  const [handle] = useState(() => delayRender())
  const [durations, setDurations] = useState<number[]>([])
  const [totalDutration, setTotalDuration] = useState(1)
  const [audioFiles, setAudioFiles] = useState<string[]>([])

  useEffect(() => {
    const effect = async () => {
      const durs: number[] = []
      const audios: string[] = []
      for await (const s of script) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const audio = require(`./../../videos/${folder}/${s.position}.mp3`)
        audios.push(audio)
        const dur = await getAudioDurationInSeconds(audio)
        durs.push(Number(((dur + 1) * fps).toFixed(0)))
      }
      setAudioFiles(audios)
      setDurations(durs)
      setTotalDuration(durs.reduce((a, b) => a + b, 0) + logoDuration)
      continueRender(handle)
    }
    effect()
  }, [handle])
  return (
    <>
      <Composition
        id={`Video`}
        component={Video}
        durationInFrames={totalDutration}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          duration: durations,
          script: script,
          audioFiles: audioFiles,
        }}
      />
      <Composition
        id={`Intro`}
        component={Intro}
        durationInFrames={4 * fps}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audio: audioFiles[0],
        }}
      />
      <Composition
        id={`Thread1`}
        component={Thread}
        durationInFrames={4 * fps}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          thread: script[1].content.thread as Tweet[],
          audio: audioFiles[1],
        }}
      />

      {script && (
        <Composition
          id={`Thread2`}
          component={Thread}
          durationInFrames={15 * fps}
          fps={fps}
          width={1920}
          height={1080}
          defaultProps={{
            thread: script[2].content.thread as Tweet[],
            audio: audioFiles[2],
          }}
        />
      )}
      <Composition
        id={`Logo`}
        component={LogoScreen}
        durationInFrames={logoDuration}
        fps={fps}
        width={1920}
        height={1080}
      />
    </>
  )
}

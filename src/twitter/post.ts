import config from './../conf.js'
import Twit from 'twit'

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER ?? '',
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET ?? '',
  access_token: process.env.TWITTER_ACCESS ?? '',
  access_token_secret: process.env.TWITTER_ACCESS_SECRET ?? '',
})
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function postVideo(status: string, filePath: string) {
  const mediaId = await uploadMedia(filePath)
  console.log(`Video uploaded ${mediaId}`)
  if (mediaId) {
    await delay(config.uploadDelay)
    return await postTweet({ status, mediaIds: [mediaId] })
  }
  return null
}

export async function postTweet({
  status,
  mediaIds,
  replyTo,
}: {
  status: string
  mediaIds?: string[]
  replyTo?: string
}): Promise<string | null> {
  return new Promise(resolve => {
    T.post(
      'statuses/update',
      { status, media_ids: mediaIds, in_reply_to_status_id: replyTo, auto_populate_reply_metadata: true },
      function (err, data) {
        if (err) {
          console.log(err)
          resolve(null)
        } else {
          resolve((data as { id_str: string }).id_str)
        }
      },
    )
  })
}

export async function uploadMedia(filePath: string): Promise<string | null> {
  return new Promise(resolve => {
    T.postMediaChunked({ file_path: filePath }, function (err, data) {
      console.log(data)
      if (err) {
        console.log(err)
        resolve(null)
      } else {
        const mediaId = (data as { media_id_string: string }).media_id_string
        resolve(mediaId)
      }
    })
  })
}

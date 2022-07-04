import { Tweet } from 'src/interfaces'
import { Client } from 'twitter-api-sdk'
const client = new Client(process.env.TWITTER_BEARER_TOKEN ?? '')

export const getThreadIds = async (query: string, count: number, start_time: string): Promise<string[]> => {
  try {
    const threadSearch = client.tweets.tweetsRecentSearch({
      query,
      start_time,
      'tweet.fields': ['public_metrics', 'referenced_tweets'],
      max_results: 100,
    })

    const threads = []
    for await (const page of threadSearch) {
      const pageThreads =
        page.data?.map(t => ({
          id: t.id,
          replyTo: t.referenced_tweets?.find(r => r.type === 'replied_to')?.id,
          likes: t.public_metrics?.like_count ?? 0,
          retweets: t.public_metrics?.retweet_count ?? 0,
          quotes: t.public_metrics?.quote_count ?? 0,
          replies: t.public_metrics?.reply_count ?? 0,
        })) ?? []
      threads.push(...pageThreads)
    }
    return threads
      .sort((a, b) => b.likes - a.likes)
      .slice(0, count)
      .map(t => t.replyTo ?? t.id)
  } catch (e) {
    console.log(e)
  }
  return []
}

export const getThreads = async (threadIds: string[]): Promise<Tweet[][]> => {
  try {
    const threads: Tweet[][] = []
    for await (const id of threadIds) {
      let nextId: string | undefined = id
      const thread: Tweet[] = []

      while (nextId) {
        const result = await client.tweets.findTweetById(nextId, {
          expansions: ['author_id'],
          'tweet.fields': ['public_metrics', 'referenced_tweets', 'attachments'],
          'user.fields': ['id', 'name', 'description', 'username', 'profile_image_url'],
        })
        if (result.data) {
          const newTweet: Tweet = {
            replyTo: result.data.referenced_tweets?.find(r => r.type === 'replied_to')?.id,
            likes: result.data.public_metrics?.like_count ?? 0,
            id: result.data.id,
            text: result.data.text,
            name: result.includes?.users?.find(u => u.id === result.data?.author_id)?.name ?? '',
            username: result.includes?.users?.find(u => u.id === result.data?.author_id)?.username ?? '',
            description: result.includes?.users?.find(u => u.id === result.data?.author_id)?.description ?? '',
            image: result.includes?.users?.find(u => u.id === result.data?.author_id)?.profile_image_url ?? '',
          }
          thread.push(newTweet)
          nextId = newTweet.replyTo
        } else {
          console.log(`Error with getting tweet with ${nextId}`)
          break
        }
      }
      threads.push(thread.reverse())
    }
    return threads
  } catch (error) {
    console.log(error)
  }
  return []
}

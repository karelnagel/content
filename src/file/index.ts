import { Post, Script } from './../interfaces'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { config } from '../config.js';

const tableName = config.table

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions: { removeUndefinedValues: true } });

export async function postScript(script: Script): Promise<string | null> {
  try {
    const params = {
      TableName: tableName,
      Item: {
        ...script
      },
    };
    await ddbDocClient.send(new PutCommand(params));
    return script.id;
  } catch (err) {
    console.log("Error", err);
    return null
  }
}

export const getScript = async (id: string): Promise<Script | null> => {
  try {
    const params = {
      TableName: tableName,
      Key: {
        id: id,
      },
    };
    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item as Script
  }
  catch (e) {
    console.log("Error", e);
    return null
  }
}
export const getQueue = async (): Promise<string[] | null> => {
  try {
    const params = {
      TableName: "queue",
      Key: {
        id: "queue",
      },
    };
    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item?.queue as string[]
  }
  catch (e) {
    console.log("Error", e);
    return null
  }
}

export async function postQueue(queue: string[]): Promise<string[] | null> {
  try {
    const params = {
      TableName: "queue",
      Item: {
        id: "queue",
        queue: queue
      },
    };
    await ddbDocClient.send(new PutCommand(params));
    return queue;
  } catch (err) {
    console.log("Error", err);
    return null
  }
}


const getPostDuration = (post: Post, recursive = true): number => {
  let length = 0
  if (post.title?.duration) {
    length += post.title.duration
  }
  if (post.body?.duration) {
    length += post.body.duration
  }
  if (post.media?.duration) {
    length += post.media.duration
  }
  if (post.replies && recursive)
    for (const reply of post.replies) {
      length += getPostDuration(reply)
    }
  return length
}

export const getLength = async (folder: string) => {
  const json = await getScript(folder)
  if (!json) return
  const length = json.scenes[0].reddit ? getPostDuration(json.scenes[0].reddit) : 0
  console.log(`${folder} length: ${length}`)
}

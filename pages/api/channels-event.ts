
import { NextApiRequest, NextApiResponse } from 'next';
import * as Pusher from "pusher"

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const {chanel, event, ...data} = request.body;
  console.log(chanel, event, data, request.body)
  const pusher = new Pusher.default({
    appId: "1540716",
    key: process.env.PUSHER_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: "eu",
    useTLS: true
  });
  
  const p = await pusher.trigger(chanel, event, {
    ...data
  }).then((res: any) => {
    if (res.status !== 200) {
      throw Error("unexpected status")
    }
    // Parse the response body as JSON
    return res.json()
  }).catch((error: any) => {
    // Handle error
    console.error(error)
    throw new Error(error)
  })

  response.send(p)
}

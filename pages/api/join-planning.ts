import { NextApiRequest, NextApiResponse } from 'next'
import * as Pusher from 'pusher'

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const pusher = new Pusher.default({
        appId: '1540716',
        key: process.env.PUSHER_KEY || '',
        secret: process.env.PUSHER_SECRET || '',
        cluster: 'eu',
        useTLS: true,
    })
    const socketId = request.body.socket_id

    // Replace this with code to retrieve the actual user id and info
    const user = {
        id: request.body.id,
        userName: request.body.name,
    }
    const auth = pusher.authenticateUser(socketId, user)
    response.send(auth)
}

import User from '@/models/user.model'

const postMsg = async (data: any, chanel: string, event: string) => {
    console.log('pushing data', data, chanel, event)
    const res = await fetch('/api/channels-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, chanel, event }),
    })
    if (!res.ok) {
        console.error('failed to push data')
    }
    return res
}

const postCardChoosen = (card: number | string, user: User, idRoom: string) => {
    return postMsg({ cardValue: card, user }, idRoom, 'card-choosen')
}

const postUserConnected = (user: User, idRoom: string) => {
    return postMsg({ user }, idRoom, 'user-connected')
}

const postFlipCards = (flipped: boolean, idRoom: string) => {
    return postMsg({ flipped }, idRoom, 'cards-flipped')
}

const postDisconnectUser = (user: User, idRoom: string) => {
    return postMsg({ user }, idRoom, 'user-disconnected')
}

const postUserChanged = (user: User, idRoom: string) => {
    return postMsg({ user }, idRoom, 'user-changed')
}

const postSelectedStory = (storyId: string, idRoom: string) => {
    return postMsg({ storyId }, idRoom, 'selected-story')
}

export {
    postCardChoosen,
    postUserConnected,
    postFlipCards,
    postDisconnectUser,
    postUserChanged,
    postSelectedStory,
}

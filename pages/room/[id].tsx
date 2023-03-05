import Card from "@/models/card.model"
import User from "@/models/user.model"
import { postMsg } from "@/utils/pusher.utils"
import { useRouter } from "next/router"
import Pusher from "pusher-js"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid'

const postCardChoosen = (card: number, user: User, idRoom: string) => {
    return postMsg({ cardValue: card, user }, idRoom, 'card-choosen')
}

const postUserConnected = (user: User, idRoom: string) => {
    return postMsg({ user }, idRoom, 'user-connected')
}

export default function Room() {
    const router = useRouter()
    const { id, routeName } = router.query
    const idRoom = `${routeName}_${id}`
    const [currentCard, setCurrentCard] = useState<number>()
    const [cards, setCards] = useState<Card[]>([])
    const [connectedUsers, setConnectedUsers] = useState<User[]>([])
    const [currentUser, setCurrentUser] = useState<User>()

    const handleChooseValue = async (e: any) => {
        if (!idRoom || Array.isArray(idRoom) || !currentUser) return
        const card = e.target.value
        setCurrentCard(card)
        postCardChoosen(card, currentUser, idRoom)
    }

    const handleNameSubmitted = (e: any) => {
        if (!idRoom || Array.isArray(idRoom)) return
        e.preventDefault()
        const newUser = { name: e.target.name.value, id: uuidv4()}
        setCurrentUser(newUser)
        postUserConnected(newUser, idRoom)
    }

    useEffect(() => {
        if (!idRoom || Array.isArray(idRoom)) return
        const pusher = new Pusher('36a15d9047517284e838', {
            cluster: 'eu',
            userAuthentication: { endpoint: '/api/join-planning', transport: 'jsonp' }
        })
        const chanel = pusher.subscribe(idRoom);
        chanel.bind('card-choosen', (data: Card) => {
            console.log('card-choosen event', data)
            setCards((oldCards) => {
                const newCards = [...oldCards]
                const index = newCards.findIndex((c) => c.user.id === data.user.id)
                if (index === -1) {
                    newCards.push(data)
                } else {
                    newCards[index] = data
                }
                return newCards
            })
        })
        chanel.bind('user-connected', ({ user }: { user: User }) => {
            console.log('user-connected event', user)
            // first, we add the new user to the list of connected users
            if (!connectedUsers.find(u => u.id === user.id)) {
                setConnectedUsers((users) => [...users, user])
                // then, we send a message to the new user to tell him we are connected & our card choose
                if (currentUser && user.id !== currentUser.id) {
                    postUserConnected(currentUser, idRoom)
                    currentCard && postCardChoosen(currentCard, currentUser, idRoom)
                }
            }
        })
        return () => {
            console.log('dicsonnecting')
            pusher.disconnect()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idRoom])

    return (
        <div>
            <h1>{routeName}</h1>
            <h2>{currentUser?.name}</h2>
            <a onClick={() => navigator.clipboard.writeText(window.location.href)}>Inviter des joueurs</a>
            {cards.map((card) =>
                <div key={card.user.id}>{card.user.name} a choisi {card.cardValue}</div>
            )}
            {!currentUser && 
                <form onSubmit={handleNameSubmitted}>
                    <label>Saisissez votre nom d&apos;utilisateur</label>
                    <input name='name'></input>
                    <button type='submit'>Valider</button>
                </form>
            }
            
            {currentUser && 
                <div>
                    Utilisateurs connectés :
                    {connectedUsers.map((user) => 
                        <div key={user.id}>{user.name}</div>
                    )}
                    <div>
                        {[1, 2, 3, 5, 8, 13, 20, 40, 100, '☕️', '♾️'].map((value) => 
                        <button key={value} onClick={handleChooseValue} value={value}>{value}</button>
                        )}
                    </div>
                    <div>
                        Ma carte: {currentCard}
                    </div>
                </div>
            }
        </div>
    )
}

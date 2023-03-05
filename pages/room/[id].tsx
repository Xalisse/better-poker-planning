import Card from "@/models/card.model"
import { postMsg } from "@/utils/pusher.utils"
import { useRouter } from "next/router"
import Pusher from "pusher-js"
import { useEffect, useState } from "react"

export default function Room() {
    const router = useRouter()
    const { id, routeName } = router.query
    const idRoom = `${routeName}_${id}`
    const [currentCard, setCurrentCard] = useState<number>()
    const [cards, setCards] = useState<Card[]>([])
    const [connectedUsers, setConnectedUsers] = useState<string[]>([])
    const [userName, setUserName] = useState(undefined)

    const handleChooseValue = async (e: any) => {
        if (!idRoom || Array.isArray(idRoom)) return
        const card = e.target.value
        setCurrentCard(card)
        postMsg({ cardValue: card, user: userName }, idRoom, 'card-choosen')
    }

    const handleNameSubmitted = (e: any) => {
        if (!idRoom || Array.isArray(idRoom)) return
        e.preventDefault()
        setUserName(e.target.name.value)
        postMsg({ user: e.target.name.value }, idRoom, 'user-connected')
    }

    useEffect(() => {
        if (!idRoom || Array.isArray(idRoom)) return
        const pusher = new Pusher('36a15d9047517284e838', {
            cluster: 'eu',
            userAuthentication: { endpoint: '/api/join-planning', transport: 'jsonp' }
        })
        const chanel = pusher.subscribe(idRoom);
        chanel.bind('card-choosen', (data: Card) => {
            console.log('card-choosen', data)
            setCards((oldCards) => {
                const newCards = [...oldCards]
                const index = newCards.findIndex((c) => c.user === data.user)
                if (index === -1) {
                    newCards.push(data)
                } else {
                    newCards[index] = data
                }
                return newCards
            })
        })
        chanel.bind('user-connected', ({ user }: { user: string }) => {
            console.log('user-connected', user)
            // first, we add the new user to the list of connected users
            if (!connectedUsers.find(u => u === user)) {
                setConnectedUsers((users) => [...users, user])
                // then, we send a message to the new user to tell him we are connected & our card choose
                if (user !== userName) {
                    postMsg({ user: userName }, idRoom, 'user-connected')
                    currentCard && postMsg({ cardValue: currentCard, user: userName }, idRoom, 'card-choosen')
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
            <h2>{userName}</h2>
            <a onClick={() => navigator.clipboard.writeText(window.location.href)}>Inviter des joueurs</a>
            {cards.map((card) =>
                <div key={card.user}>{card.user} a choisi {card.cardValue}</div>
            )}
            {!userName && 
                <form onSubmit={handleNameSubmitted}>
                    <label>Saisissez votre nom d&apos;utilisateur</label>
                    <input name='name'></input>
                    <button type='submit'>Valider</button>
                </form>
            }
            
            {userName && 
                <div>
                    Utilisateurs connectés :
                    {connectedUsers.map((user) => 
                        <div key={user}>{user}</div>
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

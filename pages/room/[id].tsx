import Card from "@/components/Card"
import UserCard from "@/components/UserCard"
import CardInterface from "@/models/card.model"
import User from "@/models/user.model"
import { postMsg } from "@/utils/pusher.utils"
import { useRouter } from "next/router"
import Pusher from "pusher-js"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid'

type CardValueType = number | string | undefined

const postCardChoosen = (card: number | string, user: User, idRoom: string) => {
    return postMsg({ cardValue: card, user }, idRoom, 'card-choosen')
}

const postUserConnected = (user: User, idRoom: string) => {
    return postMsg({ user }, idRoom, 'user-connected')
}

export default function Room() {
    const router = useRouter()
    const { id, routeName } = router.query
    const idRoom = `${routeName}_${id}`
    const [currentCard, setCurrentCard] = useState<number | string>()
    const [cards, setCards] = useState<CardInterface[]>([])
    const [connectedUsers, setConnectedUsers] = useState<User[]>([])
    const [currentUser, setCurrentUser] = useState<User>()
    const [isFlipped, setIsFlipped] = useState<boolean>(false)

    const northUser: { user: User, cardValue: CardValueType }[] = []
    const eastUser: { user: User, cardValue: CardValueType }[] = []
    const westUser: { user: User, cardValue: CardValueType }[] = []
    const southUser: { user: User, cardValue: CardValueType }[] = []
    connectedUsers.forEach((user, index) => {
        index % 4 === 0 && southUser.push({user, cardValue: cards.find(c => c.user.id === user.id)?.cardValue})
        index % 4 === 1 && northUser.push({user, cardValue: cards.find(c => c.user.id === user.id)?.cardValue})
        index % 4 === 2 && westUser.push({user, cardValue: cards.find(c => c.user.id === user.id)?.cardValue})
        index % 4 === 3 && eastUser.push({user, cardValue: cards.find(c => c.user.id === user.id)?.cardValue})
    })

    const handleChooseValue = async (card: string | number) => {
        if (!idRoom || Array.isArray(idRoom) || !currentUser) return
        setCurrentCard(card)
        postCardChoosen(card, currentUser, idRoom)
    }

    const handleCreateUser = (e: any) => {
        if (!idRoom || Array.isArray(idRoom)) return
        e.preventDefault()
        const newUser = { name: e.target.name.value, id: uuidv4()}
        setCurrentUser(newUser)
        postUserConnected(newUser, idRoom)
        localStorage.setItem('currentUser', JSON.stringify(newUser))
    }

    useEffect(() => {
        if (!idRoom || Array.isArray(idRoom)) return
        const localUser = localStorage.getItem('currentUser')
        if (localUser) {
            setCurrentUser(JSON.parse(localUser))
            postUserConnected(JSON.parse(localUser), idRoom)
        }

        const pusher = new Pusher('36a15d9047517284e838', {
            cluster: 'eu',
            userAuthentication: { endpoint: '/api/join-planning', transport: 'jsonp' }
        })
        const chanel = pusher.subscribe(idRoom);
        chanel.bind('card-choosen', (data: CardInterface) => {
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
        <div className="h-full flex flex-col justify-between pb-8">
            <h1>{routeName}</h1>
            {/* <a onClick={() => navigator.clipboard.writeText(window.location.href)}>Inviter des joueurs</a> */}
            
            {!currentUser && 
                <form onSubmit={handleCreateUser}>
                    <label>Saisissez votre nom d&apos;utilisateur</label>
                    <input name='name'></input>
                    <button type='submit'>Valider</button>
                </form>
            }
            
            {currentUser && 
                <>
                    <div className="grid grid-cols-[1fr,4fr,1fr] grid-rows-[1fr,4fr,1fr] gap-4 w-2/3 self-center items-center">
                        <div className='bg-light-pink w-96 h-52 m-auto flex items-center justify-center rounded-xl col-span-1 col-start-2 row-span-1 row-start-2'>
                            <button onClick={() => setIsFlipped(old => !old)}>Retourner les cartes</button>
                        </div>
                        <div className="col-start-2">{northUser.map(({user, cardValue}) => <UserCard key={user.id} user={user} cardValue={cardValue} isFlipped={isFlipped} />)}</div>
                        <div className="col-start-3 row-start-2">{eastUser.map(({user, cardValue}) => <UserCard key={user.id} user={user} cardValue={cardValue} isFlipped={isFlipped} />)}</div>
                        <div className="col-start-2 row-start-3">{southUser.map(({user, cardValue}) => <UserCard key={user.id} user={user} cardValue={cardValue} isFlipped={isFlipped} />)}</div>
                        <div className="col-start-1 row-start-2">{westUser.map(({user, cardValue}) => <UserCard key={user.id} user={user} cardValue={cardValue} isFlipped={isFlipped} />)}</div>
                    </div>
                    <div>
                        <p className="my-2">Choisis une carte</p>
                        <div className="flex justify-around max-w-4xl m-auto">
                            {[1, 2, 3, 5, 8, 13, 20, 40, 100, '☕️', '♾️'].map((value) => 
                                <Card value={value} onClick={() => handleChooseValue(value)} isSelected={value === currentCard} key={value}/>
                            )}
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

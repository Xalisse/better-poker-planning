import Card from '@/components/Card'
import UserCard from '@/components/UserCard'
import CardInterface from '@/models/card.model'
import User from '@/models/user.model'
import { postMsg } from '@/utils/pusher.utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FiCopy } from 'react-icons/fi'
import { toast } from 'sonner'
import { createPortal } from 'react-dom'
import ChangeName from '@/components/ChangeName'

type CardValueType = number | string | undefined

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

const postNameChanged = (user: User, idRoom: string) => {
    return postMsg({ user }, idRoom, 'name-changed')
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
    const [pusher, setPusher] = useState<Pusher>()
    const [showModalChangeName, setShowModalChangeName] =
        useState<boolean>(false)
    const currentUserRef = useRef(currentUser)
    const connectedUsersRef = useRef(connectedUsers)

    const northUser: { user: User; cardValue: CardValueType }[] = []
    const eastUser: { user: User; cardValue: CardValueType }[] = []
    const westUser: { user: User; cardValue: CardValueType }[] = []
    const southUser: { user: User; cardValue: CardValueType }[] = []
    connectedUsers.forEach((user, index) => {
        index % 4 === 0 &&
            southUser.push({
                user,
                cardValue: cards.find((c) => c.user.id === user.id)?.cardValue,
            })
        index % 4 === 1 &&
            northUser.push({
                user,
                cardValue: cards.find((c) => c.user.id === user.id)?.cardValue,
            })
        index % 4 === 2 &&
            westUser.push({
                user,
                cardValue: cards.find((c) => c.user.id === user.id)?.cardValue,
            })
        index % 4 === 3 &&
            eastUser.push({
                user,
                cardValue: cards.find((c) => c.user.id === user.id)?.cardValue,
            })
    })

    const handleChooseValue = (card: string | number) => {
        if (!currentUser) return
        setCurrentCard(card)
        postCardChoosen(card, currentUser, idRoom)
    }

    const handleCreateUser = (e: any) => {
        e.preventDefault()
        const newUser = { name: e.target.name.value, id: uuidv4() }
        setCurrentUser(newUser)
        setConnectedUsers((users) => [...users, newUser])
        postUserConnected(newUser, idRoom)
    }

    const handleFlipCards = () => {
        setIsFlipped(!isFlipped)
        postFlipCards(!isFlipped, idRoom)
    }

    const handleChangeName = (name: string) => {
        if (!currentUser) return
        setCurrentUser((user) => ({ id: user?.id || '', name }))
        setConnectedUsers((users) => {
            const index = users.findIndex((u) => u.id === currentUser.id)
            users[index].name = name
            return users
        })
        setShowModalChangeName(false)
        postNameChanged({ id: currentUser.id, name }, idRoom)
    }

    useEffect(() => {
        currentUserRef.current = currentUser
        connectedUsersRef.current = connectedUsers
    }, [currentUser, connectedUsers])

    const handleDisconnect = () => {
        console.log('dicsonnecting')
        if (currentUserRef.current) {
            postDisconnectUser(currentUserRef.current, idRoom)
        }
        pusher?.disconnect()
    }
    useEffect(() => {
        window.addEventListener('beforeunload', handleDisconnect)
        return () => {
            console.log('returning')
            window.removeEventListener('beforeunload', handleDisconnect)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pusher])

    useEffect(() => {
        connectedUsers &&
            localStorage.setItem(
                'connectedUsers',
                JSON.stringify(connectedUsers)
            )
    }, [connectedUsers])

    useEffect(() => {
        cards && localStorage.setItem('cards', JSON.stringify(cards))
    }, [cards])

    useEffect(() => {
        localStorage.setItem('isFlipped', JSON.stringify(isFlipped))
    }, [isFlipped])

    useEffect(() => {
        currentUser &&
            localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }, [currentUser])

    useEffect(() => {
        currentCard &&
            localStorage.setItem('currentCard', JSON.stringify(currentCard))
    }, [currentCard])

    useEffect(() => {
        if (!id || Array.isArray(id)) return
        const localCurrentRoom = localStorage.getItem('currentRoom')
        if (localCurrentRoom) {
            const room = JSON.parse(localCurrentRoom)
            if (room.id !== id) {
                localStorage.removeItem('currentRoom')
                localStorage.removeItem('cards')
                localStorage.removeItem('connectedUsers')
                localStorage.removeItem('currentCard')
                localStorage.removeItem('isFlipped')
            }
        }
        const localCards = localStorage.getItem('cards')
        if (localCards && cards.length === 0) {
            setCards(JSON.parse(localCards))
        }
        const localConnectedUsers = localStorage.getItem('connectedUsers')
        if (localConnectedUsers && connectedUsers.length === 0) {
            setConnectedUsers(JSON.parse(localConnectedUsers))
        }
        const localUser = localStorage.getItem('currentUser')
        if (localUser && !currentUser && JSON.parse(localUser) !== undefined) {
            const user = JSON.parse(localUser)
            setCurrentUser(user)
            postUserConnected(user, idRoom)
            if (
                localConnectedUsers &&
                !connectedUsersRef.current.find((u) => u.id === user.id)
            ) {
                setConnectedUsers((oldUsers) => [...oldUsers, user])
            }
            const localCurrentCard = localStorage.getItem('currentCard')
            if (localCurrentCard && !currentCard) {
                const card = JSON.parse(localCurrentCard)
                setCurrentCard(card)
                if (localCards && !cards.find((c) => c.user.id === user.id)) {
                    setCards((oldCards) => [
                        ...oldCards,
                        { user, cardValue: card },
                    ])
                }
            }
        }
        const localIsFlipped = localStorage.getItem('isFlipped')
        if (localIsFlipped) {
            setIsFlipped(JSON.parse(localIsFlipped))
        }

        const newPusher = new Pusher('36a15d9047517284e838', {
            cluster: 'eu',
            userAuthentication: {
                endpoint: '/api/join-planning',
                transport: 'jsonp',
            },
        })
        const chanel = newPusher.subscribe(idRoom)
        chanel.bind('card-choosen', (data: CardInterface) => {
            console.log('card-choosen event', data)
            setCards((oldCards) => {
                const newCards = [...oldCards]
                const index = newCards.findIndex(
                    (c) => c.user.id === data.user.id
                )
                if (index === -1) {
                    newCards.push(data)
                } else {
                    newCards[index] = data
                }
                return newCards
            })
        })
        chanel.bind('user-connected', ({ user }: { user: User }) => {
            console.log('user-connected event', user, connectedUsersRef.current)
            // first, we add the new user to the list of connected users
            if (!connectedUsersRef.current.find((u) => u.id === user.id)) {
                setConnectedUsers((users) => [...users, user])
                // then, we send a message to the new user to tell him we are connected & our choosen card
                if (
                    currentUserRef.current &&
                    user.id !== currentUserRef.current.id
                ) {
                    postUserConnected(currentUserRef.current, idRoom)
                    currentCard &&
                        postCardChoosen(
                            currentCard,
                            currentUserRef.current,
                            idRoom
                        )
                }
            }
        })
        chanel.bind('cards-flipped', ({ flipped }: { flipped: boolean }) => {
            if (!flipped) {
                // means we start a new planning, so we reset the cards
                setCards([])
                setCurrentCard(undefined)
            }
            setIsFlipped(flipped)
        })
        chanel.bind('user-disconnected', ({ user }: { user: User }) => {
            console.log('user-disconnected event', user)
            setConnectedUsers((users) => users.filter((u) => u.id !== user.id))
            setCards((oldCards) =>
                oldCards.filter((c) => c.user.id !== user.id)
            )
        })
        chanel.bind('name-changed', ({ user }: { user: User }) => {
            console.log('name-changed event', user)
            setConnectedUsers((users) => {
                const newUsers = [...users]
                const index = newUsers.findIndex((u) => u.id === user.id)
                if (index === -1) {
                    newUsers.push(user)
                } else {
                    newUsers[index] = user
                }
                return newUsers
            })
        })
        if (pusher) {
            pusher.disconnect()
        }
        setPusher(newPusher)

        return () => {
            console.log('dicsonnecting')
            pusher?.disconnect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    return (
        <>
            <Head>
                <title>{routeName} - Better Poker Planning 🦄</title>
            </Head>
            <div className='h-full flex flex-col justify-between pb-8'>
                <div className='grid grid-cols-3 m-2'>
                    <div
                        className='mr-auto cursor-pointer text-4xl'
                        onClick={() => router.push('/')}
                    >
                        🦄
                    </div>
                    <div>
                        <h1>{routeName}</h1>
                        {currentUser && (
                            <h2>Connecté en tant que {currentUser.name}</h2>
                        )}
                        <div>
                            <a
                                className='cursor-pointer'
                                onClick={() => setShowModalChangeName(true)}
                            >
                                Modifier mon nom
                            </a>
                            {currentUser?.name &&
                                showModalChangeName &&
                                createPortal(
                                    <ChangeName
                                        onClose={() =>
                                            setShowModalChangeName(false)
                                        }
                                        onValidate={handleChangeName}
                                        name={currentUser.name}
                                    />,
                                    document.body
                                )}
                        </div>
                    </div>
                </div>

                {!currentUser && (
                    <div className='flex flex-col m-auto gap-4'>
                        <div>Saisissez votre nom d&apos;utilisateur</div>
                        <form
                            onSubmit={handleCreateUser}
                            className='flex gap-4'
                        >
                            <input name='name'></input>
                            <button type='submit' className='primary'>
                                Valider
                            </button>
                        </form>
                    </div>
                )}

                {currentUser && (
                    <>
                        <a
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    window.location.href
                                )
                                toast('Copié dans le presse-papier ✨')
                            }}
                            className='flex items-center self-center'
                        >
                            Inviter des joueurs <FiCopy className='m-2' />
                        </a>
                        <div className='grid grid-cols-[1fr,4fr,1fr] grid-rows-[1fr,4fr,1fr] gap-4 w-2/3 self-center items-center'>
                            <div className='grid grid-rows-3 bg-light-secondary w-96 h-52 m-auto items-center justify-center rounded-xl col-span-1 col-start-2 row-span-1 row-start-2'>
                                <button
                                    onClick={handleFlipCards}
                                    className='row-start-2'
                                >
                                    {isFlipped
                                        ? 'Nouvelle estimation'
                                        : 'Retourner les cartes'}
                                </button>
                                {isFlipped && (
                                    <div className='row-start-3'>
                                        Moyenne :{' '}
                                        {cards.length > 0 &&
                                            cards.reduce(
                                                (acc, c) =>
                                                    typeof c.cardValue ===
                                                    'string'
                                                        ? acc
                                                        : acc + c.cardValue,
                                                0
                                            ) / cards.length}
                                    </div>
                                )}
                            </div>
                            <div className='col-start-2'>
                                {northUser.map(({ user, cardValue }) => (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        cardValue={cardValue}
                                        isFlipped={isFlipped}
                                    />
                                ))}
                            </div>
                            <div className='col-start-3 row-start-2'>
                                {eastUser.map(({ user, cardValue }) => (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        cardValue={cardValue}
                                        isFlipped={isFlipped}
                                    />
                                ))}
                            </div>
                            <div className='col-start-2 row-start-3'>
                                {southUser.map(({ user, cardValue }) => (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        cardValue={cardValue}
                                        isFlipped={isFlipped}
                                    />
                                ))}
                            </div>
                            <div className='col-start-1 row-start-2'>
                                {westUser.map(({ user, cardValue }) => (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        cardValue={cardValue}
                                        isFlipped={isFlipped}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className='my-2'>Choisis une carte</p>
                            <div className='flex justify-around max-w-4xl m-auto'>
                                {[
                                    1,
                                    2,
                                    3,
                                    5,
                                    8,
                                    13,
                                    20,
                                    40,
                                    100,
                                    '☕️',
                                    '♾️',
                                ].map((value) => (
                                    <Card
                                        value={value}
                                        onClick={() => handleChooseValue(value)}
                                        isSelected={value === currentCard}
                                        disabled={isFlipped}
                                        key={value}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

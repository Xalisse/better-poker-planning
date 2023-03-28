import User from '@/models/user.model'
import {
    postCardChoosen,
    postDisconnectUser,
    postFlipCards,
    postSelectedStory,
    postUserChanged,
    postUserConnected,
} from '@/utils/pusher.utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Pusher from 'pusher-js'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FiCopy } from 'react-icons/fi'
import { toast } from 'sonner'
import { createPortal } from 'react-dom'
import ChangeName from '@/components/ChangeName'
import ListStories from '@/components/ListStories'
import StoryDetails from '@/components/StoryDetails'
import {
    doc,
    DocumentData,
    getFirestore,
    onSnapshot,
    updateDoc,
} from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '@/firebase.config'
import PokerTable from '@/components/PokerTable'
import PlayerHand from '@/components/PlayerHand'
import { CardInterface, CardValueType } from '@/models/card.model'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function Room() {
    const router = useRouter()
    const { id, routeName } = router.query
    const idRoom = `${routeName}_${id}`
    const [currentCard, setCurrentCard] = useState<number | string>()
    const [cards, setCards] = useState<CardInterface[]>([])
    const [connectedUsers, setConnectedUsers] = useState<User[]>([])
    const [currentUser, setCurrentUser] = useState<User>()
    const [pusher, setPusher] = useState<Pusher>()
    const [showModalChangeName, setShowModalChangeName] =
        useState<boolean>(false)
    const currentUserRef = useRef(currentUser)
    const connectedUsersRef = useRef(connectedUsers)
    const [showUS, setShowUS] = useState<boolean>(false)
    const [selectedStoryId, setSelectedStoryId] = useState<string>()
    const [selectedStory, setSelectedStory] = useState<DocumentData>()
    const [isFlipped, setIsFlipped] = useState<boolean>(false)

    const handleChooseValue = (card: CardValueType) => {
        if (!currentUser || !card) return
        setCurrentCard(card)
        postCardChoosen(card, currentUser, idRoom)
    }

    const handleCreateUser = (e: any) => {
        e.preventDefault()
        const newUser = {
            name: e.target.name.value,
            id: uuidv4(),
            isSpectator: false,
        }
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
        setCurrentUser((user) => ({
            id: user?.id || '',
            name,
            isSpectator: user?.isSpectator || false,
        }))
        setConnectedUsers((users) => {
            const index = users.findIndex((u) => u.id === currentUser.id)
            users[index].name = name
            return users
        })
        setShowModalChangeName(false)
        postUserChanged(
            { id: currentUser.id, name, isSpectator: currentUser.isSpectator },
            idRoom
        )
    }

    const handleSpectateMode = () => {
        setCurrentUser((old) => {
            if (!old) return undefined
            if (!old.isSpectator) {
                setCurrentCard(undefined)
            }
            postUserChanged({ ...old, isSpectator: !old.isSpectator }, idRoom)
            return { ...old, isSpectator: !old.isSpectator }
        })
    }

    const handleSelectStory = (storyId: string) => {
        setSelectedStoryId(storyId)
        postSelectedStory(storyId, idRoom)
        // we reset the game
        setIsFlipped(false)
        postFlipCards(false, idRoom)
    }

    const handleSaveEstimation = async (value: string) => {
        if (!selectedStoryId) return
        // save estimation to firebase
        const storyRef = doc(db, 'rooms', `${id}`, 'stories', selectedStoryId)
        await updateDoc(storyRef, { estimation: value })
        toast.success('Éstimation sauvegardée 🪩')
    }

    const handleDisconnect = () => {
        console.log('dicsonnecting')
        if (currentUserRef.current) {
            postDisconnectUser(currentUserRef.current, idRoom)
        }
        pusher?.disconnect()
    }

    useEffect(() => {
        if (!selectedStoryId) return
        const storyRef = doc(db, 'rooms', `${id}`, 'stories', selectedStoryId)
        const unsub = onSnapshot(storyRef, (doc) => {
            setSelectedStory(doc.data())
        })
        // isFlipped(false)
        return () => unsub()
    }, [selectedStoryId, id])

    useEffect(() => {
        currentUserRef.current = currentUser
        connectedUsersRef.current = connectedUsers
    }, [currentUser, connectedUsers])

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
            console.log('cards-flipped event', flipped)
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
        chanel.bind('user-changed', ({ user }: { user: User }) => {
            console.log('user-changed event', user)
            setConnectedUsers((users) => {
                const newUsers = [...users]
                const index = newUsers.findIndex((u) => u.id === user.id)
                if (index !== -1) {
                    newUsers[index] = user
                }
                return newUsers
            })
            if (user.isSpectator) {
                setCards((oldCards) =>
                    oldCards.filter((c) => c.user.id !== user.id)
                )
            }
        })
        chanel.bind('selected-story', ({ storyId }: { storyId: string }) => {
            console.log('selected-story event', storyId)
            setSelectedStoryId(storyId)
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
            <div className='w-full h-full flex flex-col justify-between pb-4'>
                <div className='grid grid-cols-[1fr,4fr,1fr] pt-2'>
                    <div
                        className='pl-4 flex justify-left items-center cursor-pointer text-5xl'
                        onClick={() => router.push('/')}
                    >
                        <span className='transition-all hover:scale-110'>
                            🦄
                        </span>
                    </div>
                    <div className=''>
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
                    {currentUser && (
                        <div className='flex justify-center items-center'>
                            <a
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        window.location.href
                                    )
                                    toast('Copié dans le presse-papier ✨')
                                }}
                                className='flex flex-row justify-right items-center'
                            >
                                Inviter des joueurs <FiCopy className='mx-2' />
                            </a>
                        </div>
                    )}
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
                        <PokerTable
                            selectedStoryId={selectedStoryId}
                            selectedStoryTitle={selectedStory?.title}
                            playerCards={cards}
                            connectedUsers={connectedUsers}
                            doFlipCards={handleFlipCards}
                            saveEstimation={handleSaveEstimation}
                            isFlipped={isFlipped}
                        />
                        <PlayerHand
                            currentCard={currentCard}
                            currentUser={currentUser}
                            handleSpectateMode={handleSpectateMode}
                            handleChooseValue={handleChooseValue}
                            isFlipped={isFlipped}
                        />
                    </>
                )}
            </div>

            <button
                className='absolute top-[15%] right-0 rounded-r-none'
                onClick={() => setShowUS(true)}
            >
                {'< '}US
            </button>

            {showUS &&
                createPortal(
                    <>
                        <button
                            onClick={() => setShowUS(false)}
                            className='absolute right-[33%] top-[17%] rounded-r-none text-dark-tertiary !bg-white border-2 border-r-0 border-dark-tertiary'
                        >
                            {' >'}
                        </button>
                        <div className='absolute right-0 top-[15%] h-[70%] w-1/3'>
                            <div className='rounded-l-xl bg-white border-2 border-r-0 border-dark-tertiary h-full p-5 text-left overflow-auto flex flex-col justify-between'>
                                {selectedStoryId && (
                                    <div>
                                        <p className='text-lg italic'>
                                            En cours d&apos;estimation
                                        </p>
                                        <StoryDetails
                                            story={selectedStory as any}
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className='text-lg italic'>
                                        Toutes les user stories
                                    </p>
                                    <ListStories
                                        idRoom={`${id}`}
                                        selectedStoryId={selectedStoryId}
                                        selectStory={handleSelectStory}
                                    />
                                </div>
                            </div>
                        </div>
                    </>,
                    document.body
                )}
        </>
    )
}

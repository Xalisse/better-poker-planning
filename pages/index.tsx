import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase.config'
import { signIn, useSession } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

export default function Home() {
    const router = useRouter()
    const { data: session } = useSession()
    const [roomName, setRoomName] = useState<string>()
    const handleNewRoom = async (event: any) => {
        if (!session?.user?.uidFirebase) return
        event.preventDefault()
        const room = await addDoc(collection(db, 'rooms'), {
            name: roomName,
            authorizedUsers: [session.user.uidFirebase],
        })

        localStorage.setItem(
            'currentRoom',
            JSON.stringify({ idRoom: room.id, roomName })
        )
        router.push(
            `/room/${room.id}?routeName=${roomName?.replaceAll(' ', '-')}`
        )
    }

    if (!session) {
        return (
            <button
                onClick={() => signIn('google', { callbackUrl: '/logged-in' })}
                className='flex items-center gap-4 m-auto mt-8'
            >
                <FcGoogle /> Se connecter
            </button>
        )
    }

    return (
        <>
            <Head>
                <title>Better Poker Planning 🦄</title>
            </Head>
            <div className='pt-6'>
                <form
                    onSubmit={handleNewRoom}
                    className='flex flex-col items-center gap-4'
                >
                    <input
                        name='name'
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder='Nom de la salle'
                    ></input>
                    <button
                        type='submit'
                        disabled={!roomName}
                        className='primary'
                    >
                        jouer
                    </button>
                </form>
            </div>
        </>
    )
}

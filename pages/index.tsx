import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { initializeApp } from 'firebase/app'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import { firebaseConfig } from '@/firebase.config'

const app = initializeApp(firebaseConfig)

export default function Home() {
    const router = useRouter()
    const [roomName, setRoomName] = useState<string>()
    const handleNewRoom = (event: any) => {
        event.preventDefault()
        const idRoom = uuidv4()
        localStorage.setItem(
            'currentRoom',
            JSON.stringify({ idRoom, roomName })
        )
        const db = getFirestore(app)
        addDoc(collection(db, 'rooms'), { id: idRoom, name: roomName })
        router.push(
            `/room/${idRoom}?routeName=${roomName?.replaceAll(' ', '-')}`
        )
    }

    return (
        <>
            <Head>
                <title>Better Poker Planning 🦄</title>
            </Head>
            <form
                onSubmit={handleNewRoom}
                className='h-full flex flex-col justify-center items-center gap-4'
            >
                <input
                    name='name'
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder='Nom de la salle'
                ></input>
                <button type='submit' disabled={!roomName} className='primary'>
                    Créer la salle
                </button>
            </form>
        </>
    )
}

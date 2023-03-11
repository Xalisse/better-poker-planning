import { useRouter } from "next/router"
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'

export default function Home() {
    const router = useRouter()
    const [roomName, setRoomName] = useState<string>()
    const handleNewRoom = (event: any) => {
        event.preventDefault()
        const idRoom = uuidv4()
        router.push(`/room/${idRoom}?routeName=${roomName}`)
    }

    return (
        <main className='h-full pt-6'>
            <h1 className='mb-44'>Better Poker planning</h1>
            <form onSubmit={handleNewRoom}>
                <input name='name' onChange={(e) => setRoomName(e.target.value)} placeholder='Nom de la salle'></input>
                <button type='submit' disabled={!roomName}>jouer</button>
            </form>
        </main>
    )
}

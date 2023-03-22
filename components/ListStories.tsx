import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    DocumentData,
    doc,
    getDoc,
    setDoc,
    onSnapshot,
} from 'firebase/firestore'
import { firebaseConfig } from '@/firebase.config'
import { FormEventHandler, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface Props {
    idRoom: string
}

const ListStories = ({ idRoom }: Props) => {
    const [stories, setStories] = useState<DocumentData[]>([])
    const [title, setTitle] = useState<string>('')

    const handleAddStory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const storiesRef = doc(db, 'rooms', idRoom)
        const storiesSnapshot = await getDoc(storiesRef)
        const storiesList = storiesSnapshot.data()?.stories
        const newStory = {
            id: uuidv4(),
            title,
        }
        const newStories = [...storiesList, newStory]
        await setDoc(storiesRef, {
            stories: newStories,
        })
    }

    useEffect(() => {
        const getStories = async () => {
            const storiesRef = doc(db, 'rooms', idRoom)
            onSnapshot(storiesRef, (doc) => {
                const storiesList = doc.data()?.stories
                console.log(storiesList)
                setStories(storiesList)
            })
        }
        getStories()
    }, [idRoom])

    return (
        <section>
            {stories.map((story) => (
                <li key={story.id}>{story.title}</li>
            ))}

            <form onSubmit={handleAddStory}>
                <input
                    placeholder="Titre de l'US"
                    onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <button type='submit' className='primary'>
                    +
                </button>
            </form>
        </section>
    )
}

export default ListStories

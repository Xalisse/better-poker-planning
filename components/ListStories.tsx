import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    DocumentData,
    onSnapshot,
    collection,
    addDoc,
} from 'firebase/firestore'
import { firebaseConfig } from '@/firebase.config'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface Props {
    idRoom: string
    selectStory: (id: string) => void
}

const ListStories = ({ idRoom, selectStory }: Props) => {
    const [stories, setStories] = useState<DocumentData[]>([])
    const [error, setError] = useState<string>()

    const { handleChange, handleSubmit } = useFormik({
        initialValues: {
            title: '',
        },
        onSubmit: async ({ title }, { resetForm }) => {
            if (!title) return setError('Le titre est obligatoire')
            try {
                const storiesRef = collection(db, 'rooms', idRoom, 'stories')
                const newStory = {
                    title,
                }
                await addDoc(storiesRef, newStory)
                setError(undefined)
                resetForm()
            } catch (err) {
                console.error(err)
                setError('Une erreur est survenue')
            }
        },
    })

    useEffect(() => {
        const storiesRef = collection(db, 'rooms', idRoom, 'stories')
        const unsub = onSnapshot(storiesRef, (querySnapshot) => {
            const storiesList = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            setStories(storiesList)
        })
        return () => unsub()
    }, [idRoom])

    return (
        <>
            <div>
                {stories.map((story) => (
                    <li
                        key={story.id}
                        className='hover:font-bold hover:cursor-pointer'
                        onClick={() => selectStory(story.id)}
                    >
                        {story.title}
                    </li>
                ))}
            </div>
            <form onSubmit={handleSubmit} className='flex justify-end'>
                <input
                    name='title'
                    placeholder="Titre de l'US"
                    onChange={handleChange}
                    className='flex-1'
                />
                <button type='submit' className='primary ml-2'>
                    +
                </button>
                {error && <p>{error}</p>}
            </form>
        </>
    )
}

export default ListStories

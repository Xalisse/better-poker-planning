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
import { useFormik } from 'formik'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface Props {
    idRoom: string
}

const ListStories = ({ idRoom }: Props) => {
    const [stories, setStories] = useState<DocumentData[]>([])
    const [error, setError] = useState<string>()

    const { handleChange, handleSubmit } = useFormik({
        initialValues: {
            title: '',
        },
        onSubmit: async ({ title }, { resetForm }) => {
            if (!title) return setError('Le titre est obligatoire')
            try {
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
                setError(undefined)
                resetForm()
            } catch (err) {
                console.error(err)
                setError('Une erreur est survenue')
            }
        },
    })

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
        <>
            <div>
                {stories.map((story) => (
                    <li key={story.id}>{story.title}</li>
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

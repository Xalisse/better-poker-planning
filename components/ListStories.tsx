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
import { createPortal } from 'react-dom'
import AddStoryModal from './AddStoryModal'
import ModalLayout from './ModalLayout'
import ImportCsv from './ImportCsv'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface Props {
    idRoom: string
    selectedStoryId?: string
    selectStory: (id: string) => void
}

const ListStories = ({ idRoom, selectStory, selectedStoryId }: Props) => {
    const [stories, setStories] = useState<DocumentData[]>([])
    const [error, setError] = useState<string>()
    const [showModalCreateStory, setShowModalCreateStory] =
        useState<boolean>(false)
    const [showModalImportStories, setShowModalImportStories] =
        useState<boolean>(false)

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
                setShowModalCreateStory(false)
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
                        className={`hover:font-bold hover:cursor-pointer ${
                            story.id === selectedStoryId && 'font-bold'
                        }`}
                        onClick={() => selectStory(story.id)}
                    >
                        {story.title}{' '}
                        <span className='text-sm text-dark-primary'>
                            {story.estimation
                                ? `${story.estimation} points`
                                : 'Non estimée'}
                        </span>
                    </li>
                ))}
            </div>
            <button
                className='primary'
                onClick={() => setShowModalCreateStory(true)}
            >
                Créer une story
            </button>
            <button
                className='primary'
                onClick={() => setShowModalImportStories(true)}
            >
                Importer des stories
            </button>
            {showModalCreateStory &&
                createPortal(
                    <>
                        <AddStoryModal
                            handleSubmit={handleSubmit}
                            handleChange={handleChange}
                            error={error}
                            onClose={() => setShowModalCreateStory(false)}
                        />
                    </>,
                    document.body
                )}
            {showModalImportStories &&
                createPortal(
                    <ModalLayout width='w-2/3' height='h-2/3'>
                        <ImportCsv
                            onClose={() => setShowModalImportStories(false)}
                            idRoom={idRoom}
                        />
                    </ModalLayout>,
                    document.body
                )}
        </>
    )
}

export default ListStories

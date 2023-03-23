import { firebaseConfig } from '@/firebase.config'
import Story from '@/models/story.model'
import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    collection,
    addDoc,
    setDoc,
    doc,
} from 'firebase/firestore'
import Papa from 'papaparse'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    idRoom: string
    onClose: () => void
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const ImportCsv = ({ onClose, idRoom }: Props) => {
    const [file, setFile] = useState<File>()
    const [error, setError] = useState<string>()
    const [warning, setWarning] = useState<string[]>()
    const [previewData, setPreviewData] = useState<Story[]>()
    const [loading, setLoading] = useState<boolean>(false)

    const handleTransformCsv = () => {
        if (!file) return
        setLoading(true)
        Papa.parse<Story>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                console.log('results: ', results)
                if (results.errors)
                    setWarning(results.errors.map((err) => err.message))
                if (results.data) {
                    console.log(Object.hasOwn(results.data[0], 'id'))
                    setPreviewData(
                        results.data.filter(
                            (story) =>
                                Object.hasOwn(story, 'id') &&
                                Object.hasOwn(story, 'title') &&
                                Object.hasOwn(story, 'estimation') &&
                                Object.hasOwn(story, 'description')
                        )
                    )
                }
                setLoading(false)
            },
            error: (err) => {
                console.error(err)
                setError(err.message)
                setLoading(false)
            },
        })
    }

    const handleImportData = async (stories: Story[]) => {
        setLoading(true)
        const addStoriesPromises = stories.map((story) => {
            console.log(story)
            if (!story || !story.id) return
            const storyRef = doc(db, 'rooms', idRoom, 'stories', story.id)
            return setDoc(storyRef, story)
        })
        await Promise.all(addStoriesPromises)
        setLoading(false)
        toast.success('User stories importées avec succès 🦄')
        onClose()
    }

    return (
        <>
            <p>Import de stories</p>
            <input
                type='file'
                accept='.csv'
                name='file'
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            <button
                onClick={handleTransformCsv}
                disabled={!file}
                className='primary'
            >
                Prévisualiser
            </button>

            {error && <p>{error}</p>}
            {warning && warning.map((err) => <p key={err}>{err}</p>)}

            {previewData &&
                previewData.map((story) => (
                    <div key={story.id}>
                        <p>{story.title}</p>
                        <p>{story.estimation}</p>
                    </div>
                ))}

            {loading && <p>Chargement...</p>}

            <button
                onClick={onClose}
                className='border-2 border-dark-secondary !bg-opacity-0 text-dark-secondary mx-2'
            >
                Annuler
            </button>
            <button
                onClick={() => previewData && handleImportData(previewData)}
                className='primary'
                disabled={!previewData || !!error}
            >
                Importer
            </button>
        </>
    )
}

export default ImportCsv

import { firebaseConfig } from '@/firebase.config'
import Story from '@/models/story.model'
import { initializeApp } from 'firebase/app'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
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
                const someStoriesBadFormat = results.data.some(
                    (story) =>
                        !Object.hasOwn(story, 'id') ||
                        !Object.hasOwn(story, 'title') ||
                        !Object.hasOwn(story, 'estimation') ||
                        !Object.hasOwn(story, 'description')
                )
                if (someStoriesBadFormat) {
                    setWarning([
                        "Certaines user stories n'ont pas le bon format. Les champs id, title, description et estimation sont obligatoires.",
                    ])
                }

                const goodFormatStories = results.data.filter(
                    (story) =>
                        Object.hasOwn(story, 'id') &&
                        Object.hasOwn(story, 'title') &&
                        Object.hasOwn(story, 'estimation') &&
                        Object.hasOwn(story, 'description')
                )
                if (goodFormatStories.length > 0) {
                    setPreviewData(goodFormatStories)
                }

                if (results.errors)
                    setWarning((old) => {
                        const warns = results.errors.map((err) => err.message)
                        return old ? [...old, ...warns] : warns
                    })
                setLoading(false)
            },
            error: (err) => {
                console.error(err)
                setError(err.message)
                setLoading(false)
            },
        })
    }

    const handleChangeFile = (file: File) => {
        setFile(file)
        setPreviewData(undefined)
        setWarning(undefined)
        setError(undefined)
    }

    const handleImportData = async (stories: Story[]) => {
        setLoading(true)
        const addStoriesPromises = stories.map((story) => {
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
        <div className='flex flex-col h-full justify-between p-4'>
            <div>
                <p className='text-lg font-bold'>Import de stories</p>
                <p className='text-tertiary'>
                    Le fichier doit être au format csv et avoir les entêtes
                    suivantes : id, title, description, estimation
                </p>

                <div
                    className='flex justify-center mt-8'
                    style={{ alignItems: 'stretch' }}
                >
                    <input
                        type='file'
                        accept='.csv'
                        name='file'
                        className='border-dark-secondary'
                        onChange={(e) =>
                            e.target.files &&
                            handleChangeFile(e.target.files[0])
                        }
                    />
                    <button
                        onClick={handleTransformCsv}
                        disabled={!file}
                        className='primary ml-4'
                    >
                        Prévisualiser
                    </button>
                </div>
            </div>
            {error && <p>{error}</p>}
            {warning && warning.map((err) => <p key={err}>{err}</p>)}
            {loading && <p>Chargement...</p>}

            {previewData && (
                <div className='text-left'>
                    {previewData.map((story) => (
                        <li key={story.id}>
                            {story.id}
                            {' - '}
                            {story.title}
                            <span className='text-sm text-primary ml-2'>
                                {story.estimation
                                    ? `${story.estimation} points`
                                    : 'Non estimée'}
                            </span>
                        </li>
                    ))}
                </div>
            )}

            <div>
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
            </div>
        </div>
    )
}

export default ImportCsv

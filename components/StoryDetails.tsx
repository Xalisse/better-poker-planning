import { initializeApp } from 'firebase/app'
import { getFirestore, DocumentData, doc, onSnapshot } from 'firebase/firestore'
import { firebaseConfig } from '@/firebase.config'
import { useEffect, useState } from 'react'

interface Props {
    storyId: string
    idRoom: string
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const StoryDetails = ({ storyId, idRoom }: Props) => {
    const [story, setStory] = useState<DocumentData>()
    useEffect(() => {
        const storyRef = doc(db, 'rooms', idRoom, 'stories', storyId)
        const unsub = onSnapshot(storyRef, (doc) => {
            setStory(doc.data())
        })
        return () => unsub()
    }, [storyId, idRoom])

    return (
        <div>
            <p>{story?.title}</p>
            <div>{story?.description}</div>
        </div>
    )
}

export default StoryDetails

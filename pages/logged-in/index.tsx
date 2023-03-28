import { app } from '@/firebase.config'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { useSession } from 'next-auth/react'
import router from 'next/router'
import { useEffect } from 'react'

export default function LoggedIn() {
    const { data: session } = useSession()
    useEffect(() => {
        console.log(session)
        if (!session || !session.customToken) return
        const auth = getAuth(app)
        signInWithCustomToken(auth, session.customToken).then(() =>
            router.push('/')
        )
    }, [session])
    return <div>Login in progress </div>
}

// eslint-disable-next-line no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
    // eslint-disable-next-line no-unused-vars
    interface Session {
        user: {
            name: string
            email: string
            image: string
            uidFirebase: string
            uidFirebase: string
        }
        customToken: string
        expires: string
    }
}

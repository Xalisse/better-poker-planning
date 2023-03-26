import NextAuth, { Session } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID_AUTH || '',
            clientSecret: process.env.GOOGLE_SECRET_AUTH || '',
        }),
    ],
}

export default NextAuth(authOptions)

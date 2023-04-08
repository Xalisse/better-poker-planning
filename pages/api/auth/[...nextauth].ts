import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { FirestoreAdapter } from '@next-auth/firebase-adapter'
import { db } from '@/firebase.config'
import * as firestoreFunction from 'firebase/firestore'
import { getAuth } from 'firebase-admin/auth'
import { cert } from 'firebase-admin/app'
import { decode } from 'jsonwebtoken'

export const authOptions = {
    adapter: FirestoreAdapter({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
        db,
        ...firestoreFunction,
    } as any),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID_AUTH || '',
            clientSecret: process.env.GOOGLE_SECRET_AUTH || '',
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' as 'jwt' },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.customToken = await getAuth().createCustomToken(user.id, {
                    email: user.email,
                })
            }
            return token
        },
        session: async ({ session, token }: any) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    uidFirebase: (decode(token.customToken) as any).uid,
                },
                customToken: token.customToken,
            }
        },
    },
}

export default NextAuth(authOptions)

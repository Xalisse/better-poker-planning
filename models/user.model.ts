interface User {
    name: string | undefined | null
    email: string
    id: string
    picture?: string | undefined | null
    isSpectator: boolean
    uidFirebase: string
}

export default User

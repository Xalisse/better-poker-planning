interface User {
    name: string | undefined | null
    id: string
    picture?: string | undefined | null
    isSpectator: boolean
}

export default User

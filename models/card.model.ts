import User from './user.model'

export type CardValueType = number | string | undefined
export interface CardInterface {
    cardValue: number | string
    user: User
}

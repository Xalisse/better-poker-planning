import { CardInterface } from '@/models/card.model'

export function areCardsValueEqual(cards: CardInterface[]) {
    return cards.every((card) => card.cardValue === cards[0].cardValue)
}

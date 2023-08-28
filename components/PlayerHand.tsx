import { CardValueType } from '@/models/card.model'
import User from '@/models/user.model'
import Card from './Card'
import { GiTabletopPlayers } from 'react-icons/gi'
import { IoEyeSharp } from 'react-icons/io5'
import { useEffect, useState } from 'react'

interface Props {
    currentUser: User
    isFlipped: boolean
    currentCard: CardValueType
    handleSpectateMode: () => void
    handleChooseValue: (value: CardValueType) => void
}

const PlayerHand = ({
    currentUser,
    handleSpectateMode,
    handleChooseValue,
    isFlipped,
    currentCard,
}: Props) => {
    const [hideCards, setHideCards] = useState(false)

    useEffect(() => {
        if (currentUser.isSpectator) {
            const timeout = setTimeout(() => {
                setHideCards(true)
            }, 1000)

            return () => {
                clearTimeout(timeout)
            }
        } else if (!currentUser.isSpectator) {
            setHideCards(false)
        }
    }, [currentUser.isSpectator])

    return (
        <div className='fixed bottom-0 left-0 flex flex-row gap-4 p-4'>
            <button
                className='primary w-24 h-24 rounded-full bg-dark-secondary flex justify-center items-center'
                onClick={handleSpectateMode}
            >
                {currentUser.isSpectator ? (
                    <GiTabletopPlayers className='text-6xl text-white' />
                ) : (
                    <IoEyeSharp className='text-6xl text-white' />
                )}
            </button>
            {!hideCards && (
                <div
                    className={`fixed bottom-0 left-[15%] w-[70%] flex flex-row justify-center show-cards ${
                        currentUser.isSpectator && 'hide-cards'
                    }`}
                >
                    {[1, 2, 3, 5, 8, 13, 20, 40, 100, '☕️', '♾️'].map(
                        (value) => (
                            <Card
                                value={value}
                                onClick={() => handleChooseValue(value)}
                                isSelected={value === currentCard}
                                isOnHands
                                disabled={isFlipped}
                                key={value}
                            />
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export default PlayerHand

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
        <>
            <div className='fixed bottom-10 left-0 flex flex-row gap-4 p-4'>
                <button
                    className='w-auto px-4 rounded-full flex justify-center items-center cursor-pointer gap-2'
                    onClick={handleSpectateMode}
                    disabled={isFlipped}
                >
                    {currentUser.isSpectator ? (
                        <GiTabletopPlayers className='text-5xl' />
                    ) : (
                        <IoEyeSharp className='text-5xl' />
                    )}
                    <span>
                        {currentUser.isSpectator ? 'Jouer' : 'Regarder'}
                    </span>
                </button>
            </div>
            {!hideCards && (
                <div
                    className={`fixed bottom-10 left-[15%] w-[70%] flex flex-row justify-center show-cards ${
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
        </>
    )
}

export default PlayerHand

import { CardValueType } from '@/models/card.model'
import User from '@/models/user.model'
import Card from './Card'
import { GiCardPlay, GiTabletopPlayers } from 'react-icons/gi'
import { IoEyeSharp } from 'react-icons/io5'
import { useState } from 'react'

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
    // return (
    //     <div className='absolute flex flex-col items-center bottom-0 w-full bg-extra-light-secondary pt-4'>
    //         {!currentUser.isSpectator && (
    //             <>
    //                 <span
    //                     className='text-dark-secondary font-bold cursor-pointer'
    //                     onClick={handleSpectateMode}
    //                 >
    //                     Mode spectateur 👁️
    //                 </span>
    //                 <div className='flex justify-around max-w-4xl m-auto'>
    //                     {[1, 2, 3, 5, 8, 13, 20, 40, 100, '☕️', '♾️'].map(
    //                         (value) => (
    //                             <Card
    //                                 value={value}
    //                                 onClick={() => handleChooseValue(value)}
    //                                 isSelected={value === currentCard}
    //                                 isOnHands
    //                                 disabled={isFlipped}
    //                                 key={value}
    //                             />
    //                         )
    //                     )}
    //                 </div>
    //                 <div className='mt-2 p-4 rounded-t-full w-1/5 bg-light-secondary'>
    //                     Choisis une carte
    //                 </div>
    //             </>
    //         )}
    //         {currentUser.isSpectator && (
    //             <>
    //                 <span
    //                     className='text-dark-secondary font-bold cursor-pointer'
    //                     onClick={handleSpectateMode}
    //                 >
    //                     Mode joueur 🃏
    //                 </span>
    //             </>
    //         )}
    //     </div>
    // )

    const [visibleCards, setVisibleCards] = useState(false)

    return (
        <div className='fixed bottom-0 left-0 flex flex-row gap-4 p-4'>
            {!currentUser.isSpectator && (
                <button
                    className='primary w-24 h-24 rounded-full bg-dark-secondary flex justify-center items-center'
                    onClick={() => {
                        setVisibleCards(!visibleCards)
                    }}
                >
                    <GiCardPlay className='text-6xl text-white' />
                </button>
            )}
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
            {visibleCards && !currentUser.isSpectator && (
                <div className='fixed top-[7%] left-0 h-[80%] w-1/12 flex flex-col justify-end'>
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

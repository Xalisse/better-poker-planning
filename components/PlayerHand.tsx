import { CardValueType } from '@/models/card.model'
import User from '@/models/user.model'
import Card from './Card'

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
    return (
        <div className='fixed flex flex-col items-center bottom-10 w-full bg-extra-light-secondary pt-4'>
            {!currentUser.isSpectator && (
                <>
                    <span
                        className='text-dark-secondary font-bold cursor-pointer'
                        onClick={handleSpectateMode}
                    >
                        Mode spectateur 👁️
                    </span>
                    <div className='flex justify-around max-w-4xl m-auto'>
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
                    <div className='mt-2 p-4 rounded-t-full w-1/5 bg-light-secondary'>
                        Choisis une carte
                    </div>
                </>
            )}
            {currentUser.isSpectator && (
                <>
                    <span
                        className='text-dark-secondary font-bold cursor-pointer'
                        onClick={handleSpectateMode}
                    >
                        Mode joueur 🃏
                    </span>
                </>
            )}
        </div>
    )
}

export default PlayerHand

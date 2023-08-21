import { CardValueType } from '@/models/card.model'
import User from '@/models/user.model'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import UserCard from './UserCard'

interface Props {
    selectedStoryTitle?: string
    selectedStoryId?: string
    playerCards: { user: User; cardValue: CardValueType }[]
    connectedUsers: User[]
    isFlipped: boolean
    doFlipCards: () => void
    saveEstimation: (storyId: string, value: string) => void
}

const average = (cards: { user: User; cardValue: CardValueType }[]) => {
    if (cards.length === 0) return '☕️'
    const total = cards.reduce(
        (acc, c) =>
            typeof c.cardValue === 'string' ? acc : acc + (c.cardValue ?? 0),
        0
    )
    const voting = cards.filter(
        (c) => typeof c.cardValue === 'number' && !c.user.isSpectator
    ).length

    return total / voting
}

const PokerTable = ({
    selectedStoryTitle,
    selectedStoryId,
    doFlipCards,
    saveEstimation,
    playerCards,
    connectedUsers,
    isFlipped,
}: Props) => {
    const northUser: { user: User; cardValue: CardValueType }[] = []
    const eastUser: { user: User; cardValue: CardValueType }[] = []
    const westUser: { user: User; cardValue: CardValueType }[] = []
    const southUser: { user: User; cardValue: CardValueType }[] = []

    connectedUsers.forEach((user, index) => {
        index % 4 === 0 &&
            southUser.push({
                user,
                cardValue: playerCards.find((c) => c.user.id === user.id)
                    ?.cardValue,
            })
        index % 4 === 1 &&
            northUser.push({
                user,
                cardValue: playerCards.find((c) => c.user.id === user.id)
                    ?.cardValue,
            })
        index % 4 === 2 &&
            westUser.push({
                user,
                cardValue: playerCards.find((c) => c.user.id === user.id)
                    ?.cardValue,
            })
        index % 4 === 3 &&
            eastUser.push({
                user,
                cardValue: playerCards.find((c) => c.user.id === user.id)
                    ?.cardValue,
            })
    })

    const {
        handleChange: handleChangeEstimation,
        handleSubmit: handleSaveEstimation,
        setFieldValue: setEstimationValue,
        values: valuesEstimation,
    } = useFormik({
        initialValues: {
            value: '',
        },
        onSubmit: async ({ value }) => {
            if (!selectedStoryId || !value) return
            saveEstimation(selectedStoryId, value)
        },
    })

    const handleFlipCards = () => {
        setEstimationValue('value', average(playerCards))
        doFlipCards()
    }

    useEffect(() => {
        console.log('ISFLIPPED', isFlipped)
    }, [isFlipped])

    return (
        <div className='grid grid-cols-[1fr,3fr,1fr] grid-rows-[2fr,3fr,2fr] w-2/3 self-center py-10 gap-4'>
            <div className='grid grid-rows-3 bg-light-secondary w-full h-full m-auto items-center justify-center rounded-xl col-span-1 col-start-2 row-span-1 row-start-2'>
                {selectedStoryTitle && <div>{selectedStoryTitle}</div>}
                <button
                    onClick={handleFlipCards}
                    className='row-start-2 m-2 primary'
                >
                    {isFlipped ? 'Nouvelle estimation' : 'Retourner les cartes'}
                </button>
                {isFlipped && selectedStoryId && (
                    <form
                        className='row-start-3'
                        onSubmit={handleSaveEstimation}
                    >
                        Estimation :{' '}
                        <input
                            name='value'
                            onChange={handleChangeEstimation}
                            value={valuesEstimation.value}
                        />
                        <button className='primary m-2' type='submit'>
                            Sauvegarder
                        </button>
                    </form>
                )}
                {isFlipped && !selectedStoryId && (
                    <div className='row-start-3'>
                        Estimation : {average(playerCards)}
                    </div>
                )}
            </div>
            <div className='col-start-1 col-end-4 row-start-1 flex flex-row justify-center items-center gap-12'>
                {northUser.map(({ user, cardValue }) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        cardValue={cardValue}
                        isFlipped={isFlipped}
                    />
                ))}
            </div>
            <div className='col-start-3 row-start-2 flex flex-col justify-center items-center gap-8'>
                {eastUser.map(({ user, cardValue }) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        cardValue={cardValue}
                        isFlipped={isFlipped}
                    />
                ))}
            </div>
            <div className='col-start-1 col-end-4 row-start-3 flex flex-row justify-center items-center gap-12'>
                {southUser.map(({ user, cardValue }) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        cardValue={cardValue}
                        isFlipped={isFlipped}
                    />
                ))}
            </div>
            <div className='col-start-1 row-start-2 flex flex-col justify-center items-center gap-8'>
                {westUser.map(({ user, cardValue }) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        cardValue={cardValue}
                        isFlipped={isFlipped}
                    />
                ))}
            </div>
        </div>
    )
}

export default PokerTable

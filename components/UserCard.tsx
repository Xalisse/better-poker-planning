import User from "@/models/user.model";
import Card from "./Card";

interface Props {
    user: User
    cardValue: string | number | undefined
    isFlipped: boolean
}

const BackCard = () => {
    return <div className="flex items-center justify-center rounded-lg w-12 h-20 bg-pink">🦄</div>
}

const EmptyCard = () => {
    return <div className="flex items-center justify-center rounded-lg w-12 h-20 border-2 border-pink"></div>
}

export default function UserCard({ user, cardValue, isFlipped = false }: Props) {
    return (
        <div className="flex flex-col w-fit m-auto">
            {isFlipped && <Card value={cardValue || ''} />}
            {!isFlipped && cardValue && <BackCard />}
            {!isFlipped && !cardValue && <EmptyCard />}
            <p>{user.name}</p>
        </div>
    )
}

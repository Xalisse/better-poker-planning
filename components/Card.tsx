interface Props {
    value: string | number
    disabled?: boolean
    isSelected?: boolean
    isOnHands?: boolean
    onClick?: () => void
}

export default function Card({
    value,
    onClick,
    disabled = false,
    isSelected = false,
    isOnHands = false,
}: Props) {
    return (
        <div
            className={`border-2 rounded-lg flex justify-center items-center text-blue font-bold ${
                isSelected
                    ? 'bg-extra-dark-tertiary text-extra-light-primary'
                    : 'bg-white'
            } hover:cursor-pointer ${
                isOnHands
                    ? 'w-16 h-28 my-1 transition-all mx-[-0.5em] draw-card'
                    : 'w-12 h-20'
            }`}
            onClick={(e) => !disabled && onClick && onClick()}
        >
            {value}
        </div>
    )
}

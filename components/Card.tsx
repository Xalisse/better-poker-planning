interface Props {
    value: string | number
    disabled?: boolean
    isSelected?: boolean
    onClick?: () => void
}

export default function Card({ value, onClick, disabled = false, isSelected = false }: Props) {
    return (
        <div className={`border-2 rounded-lg w-12 h-20 flex justify-center items-center text-blue font-bold ${isSelected ? 'bg-extra-dark-tertiary text-extra-light-primary' : 'bg-white'} hover:cursor-pointer`} onClick={(e) => !disabled && onClick && onClick()}>
            {value}
        </div>
    )
}

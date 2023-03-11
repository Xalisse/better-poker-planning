interface Props {
    value: string | number
    isSelected?: boolean
    onClick?: (e: any) => void
}

export default function Card({ value, onClick, isSelected = false }: Props) {
    return (
        <div className={`border-2 border-blue bg-light rounded-lg w-12 h-20 flex justify-center items-center text-blue font-bold ${isSelected && 'bg-blue text-light'} hover:cursor-pointer`} onClick={onClick}>
            {value}
        </div>
    )
}

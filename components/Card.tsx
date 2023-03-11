interface Props {
    value: string | number
    isSelected: boolean
    onClick: (e: any) => void
}

export default function Card({ value, isSelected, onClick }: Props) {
    return (
        <div className={`border-2 border-blue rounded-lg w-12 h-20 flex justify-center items-center text-blue font-bold ${isSelected && 'bg-blue text-light'}`} onClick={onClick}>
            {value}
        </div>
    )
}

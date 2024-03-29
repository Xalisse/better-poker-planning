interface Props {
    children: React.ReactNode
    width?: string
    height?: string
}

const ModalLayout = ({ children, width = 'w-96', height = 'h-72' }: Props) => {
    return (
        <div className='absolute top-0 left-0 flex items-center justify-center bg-extra-dark-tertiary bg-opacity-30 w-[100vw] h-[100vh] z-50'>
            <div
                className={`bg-white border rounded-lg p-4 ${width} ${height}`}
            >
                {children}
            </div>
        </div>
    )
}

export default ModalLayout

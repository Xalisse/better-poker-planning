interface Props {
    children: React.ReactNode
    width?: string
    height?: string
}

const ModalLayout = ({ children, width = 'w-96', height = 'h-72' }: Props) => {
    return (
        <div className='absolute top-0 left-0 flex items-center justify-center bg-extra-dark-tertiary bg-opacity-30 w-[100vw] h-[100vh]'>
            <div
                className={`bg-white border rounded-lg grid grid-rows-3 items-center p-4 ${width} ${height}`}
            >
                {children}
            </div>
        </div>
    )
}

export default ModalLayout

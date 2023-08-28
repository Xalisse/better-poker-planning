import { createPortal } from 'react-dom'
import { FiCopy, FiEdit, FiSettings } from 'react-icons/fi'
import { toast } from 'sonner'
import ChangeName from './ChangeName'

interface Props {
    currentUser?: any
    showModalChangeName: boolean
    setShowModalChangeName: (arg: boolean) => void
    handleChangeName: (name: string) => void
}

const Settings = ({
    currentUser,
    showModalChangeName,
    setShowModalChangeName,
    handleChangeName,
}: Props) => {
    return (
        <>
            {currentUser && (
                <div className='fixed top-0 right-0 flex flex-col gap-4 justify-start items-end w-64 h-40 py-4 px-6 rounded-bl-full bg-dark-secondary z-10'>
                    <FiSettings className='text-dark-secondary text-8xl absolute bottom-[-25px] left-[25px]' />
                    <a
                        className='flex flex-row justify-right items-center gap-2 cursor-pointer text-white'
                        onClick={() => setShowModalChangeName(true)}
                    >
                        Modifier mon nom <FiEdit />
                    </a>
                    <a
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                            toast('Copié dans le presse-papier ✨')
                        }}
                        className='flex flex-row justify-right items-center gap-2 text-white'
                    >
                        Inviter des joueurs <FiCopy />
                    </a>

                    {currentUser?.name &&
                        showModalChangeName &&
                        createPortal(
                            <ChangeName
                                onClose={() => setShowModalChangeName(false)}
                                onValidate={handleChangeName}
                                name={currentUser.name}
                            />,
                            document.body
                        )}
                </div>
            )}
        </>
    )
}

export default Settings

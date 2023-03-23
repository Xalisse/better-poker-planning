import { useState } from 'react'
import ModalLayout from './ModalLayout'

interface Props {
    name: string
    onClose: () => void
    onValidate: (name: string) => void
}

const ChangeName = ({ name, onClose, onValidate }: Props) => {
    const [newName, setNewName] = useState(name)

    return (
        <ModalLayout>
            <div className='flex flex-col justify-between h-full'>
                <p className='text-lg font-bold'>Modifier mon nom</p>
                <input
                    type='text'
                    defaultValue={name}
                    name='newName'
                    onChange={(e) => setNewName(e.target.value)}
                />
                <div className='flex self-end justify-end'>
                    <button
                        onClick={onClose}
                        className='border-2 border-dark-secondary !bg-opacity-0 text-dark-secondary mx-4'
                    >
                        Annuler
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            onValidate(newName)
                        }}
                        className='primary'
                    >
                        Valider
                    </button>
                </div>
            </div>
        </ModalLayout>
    )
}

export default ChangeName

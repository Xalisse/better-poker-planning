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
            <p className='text-xl'>Modifier mon nom</p>
            <input
                type='text'
                defaultValue={name}
                name='newName'
                onChange={(e) => setNewName(e.target.value)}
                className='row-start-2'
            />
            <div className='flex row-start-3 self-end justify-end'>
                <button
                    onClick={onClose}
                    className='border-2 border-dark-secondary !bg-opacity-0 text-dark-secondary mx-4'
                >
                    Cancel
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        onValidate(newName)
                    }}
                    className='primary'
                >
                    Validate
                </button>
            </div>
        </ModalLayout>
    )
}

export default ChangeName

import ModalLayout from './ModalLayout'

interface Props {
    handleSubmit: () => void
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error: string | undefined
    onClose: () => void
}

const AddStoryModal = ({
    handleSubmit,
    handleChange,
    error,
    onClose,
}: Props) => {
    return (
        <ModalLayout>
            <div className='flex flex-col h-full justify-between'>
                <p className='text-lg font-bold'>Créer une user story</p>
                <input
                    name='title'
                    placeholder="Titre de l'US"
                    onChange={handleChange}
                />
                {error && <p>{error}</p>}
                <div className='flex self-end'>
                    <button
                        className='border-2 border-dark-secondary !bg-opacity-0 text-dark-secondary mx-4'
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                    <button onClick={handleSubmit} className='primary'>
                        Ajouter
                    </button>
                </div>
            </div>
        </ModalLayout>
    )
}

export default AddStoryModal

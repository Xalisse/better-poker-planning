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
            <input
                name='title'
                placeholder="Titre de l'US"
                onChange={handleChange}
                className='flex-1'
            />
            {error && <p>{error}</p>}
            <button
                className='border-2 border-dark-secondary !bg-opacity-0 text-dark-secondary mx-2'
                onClick={onClose}
            >
                Annuler
            </button>
            <button onClick={handleSubmit} className='primary mx-2'>
                Ajouter
            </button>
        </ModalLayout>
    )
}

export default AddStoryModal

import { useState } from "react"

interface Props {
    name: string
    onClose: () => void
    onValidate: (name: string) => void
}

const ChangeName = ({ name, onClose, onValidate }: Props) => {
    const [newName, setNewName] = useState(name)

    return (
        <div className="absolute top-0 left-0 flex items-center justify-center bg-extra-dark-tertiary bg-opacity-30 w-[100vw] h-[100vh]">
            <div className="bg-white border rounded-lg grid grid-rows-3 items-center p-4 h-72 w-96">
                <p className="text-xl">Modifier mon nom</p>
                <input type="text" defaultValue={name} name="newName" onChange={e => setNewName(e.target.value)} className='row-start-2' />
                <div className="flex row-start-3 self-end justify-end">
                    <button onClick={onClose} className="border-2 border-dark-secondary !bg-opacity-0 text-dark-secondary mx-4">Cancel</button>
                    <button onClick={(e) => { e.preventDefault(); onValidate(newName) }} className="primary">Validate</button>
                </div>
            </div>
        </div>
    )
    
}

export default ChangeName

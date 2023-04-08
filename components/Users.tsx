import User from '@/models/user.model'
import { useFormik } from 'formik'
import { NextPage } from 'next'
import { FiPlus } from 'react-icons/fi'
import ListUsers from './ListUsers'

interface Props {
    authorizedUsers: User[]
    onAddUser: (email: string) => void
}

const Users: NextPage<Props> = ({ authorizedUsers, onAddUser }) => {
    const { handleSubmit, handleChange } = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: (values) => {
            onAddUser(values.email)
        },
    })

    return (
        <>
            <h2>Personnes ayant accès</h2>

            <ListUsers users={authorizedUsers} />

            <form onSubmit={handleSubmit}>
                <p>Ajouter un utilisateur</p>
                <input
                    type='text'
                    placeholder='user@gmail.com'
                    name='email'
                    onChange={handleChange}
                />
                <button type='submit'>
                    <FiPlus />
                </button>
            </form>
        </>
    )
}

export default Users

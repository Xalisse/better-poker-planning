import User from '@/models/user.model'
import { NextPage } from 'next'

interface Props {
    users: User[]
}

const ListUsers: NextPage<Props> = ({ users }) => {
    return (
        <div>
            {users.map((user) => (
                <div key={user.uidFirebase}>{user.email}</div>
            ))}
        </div>
    )
}

export default ListUsers

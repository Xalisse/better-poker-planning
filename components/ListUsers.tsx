import User from '@/models/user.model'
import { NextPage } from 'next'

interface Props {
    users: User[]
    allUsersEmail: string[]
}

const ListUsers: NextPage<Props> = ({ users, allUsersEmail }) => {
    return (
        <div>
            {users.map((user) => (
                <div key={user.uidFirebase}>{user.email}</div>
            ))}

            <div className='text-tertiary'>
                Ils ne se sont pas encore connectés :
                {allUsersEmail
                    .filter(
                        (email) => !users.find((user) => user.email === email)
                    )
                    .map((email) => (
                        <div key={email}>{email}</div>
                    ))}
            </div>
        </div>
    )
}

export default ListUsers

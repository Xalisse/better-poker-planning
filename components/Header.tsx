import { useRouter } from 'next/router'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { FiLogOut } from 'react-icons/fi'

const Header = () => {
    const router = useRouter()
    const { data: session } = useSession()

    const handleDeconnection = () => {
        signOut({ redirect: false })
        router.push('/')
    }

    return (
        <nav className='grid grid-cols-3 p-1 border-b w-full items-center'>
            <span
                className='justify-self-start cursor-pointer text-4xl transition-all hover:scale-110'
                onClick={() => router.push('/')}
            >
                🦄
            </span>
            <p className='text-2xl'>Better Poker planning</p>

            {session && (
                <div
                    className='relative place-self-end self-center'
                    onClick={handleDeconnection}
                >
                    <Image
                        src={session?.user?.image || ''}
                        alt='avatar'
                        width={30}
                        height={30}
                        className='rounded-full justify-self-end cursor-pointer hover:opacity-10 duration-150'
                    />
                    <FiLogOut className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10' />
                </div>
            )}
        </nav>
    )
}

export default Header

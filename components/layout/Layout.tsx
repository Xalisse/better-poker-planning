import { ReactElement } from 'react'
import { Comfortaa } from '@next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/router'
const comfortaa = Comfortaa({
    subsets: ['latin'],
    variable: '--comfortaa-font',
})

interface Props {
    className: string
    children: ReactElement
}

const Layout = ({ className, children }: Props) => {
    const router = useRouter()

    return (
        <div className={className}>
            <header className='p-2 w-full items-center justify-between'>
                <div className='flex flex-row items-center'>
                    <div className='flex flex-row gap-4 items-center'>
                        <Link href='/'>
                            <span className='text-5xl cursor-pointer'>🦄</span>
                        </Link>
                        <h1
                            className={`${
                                router.query.routeName && 'pr-4 mr-4 border-r'
                            }`}
                        >
                            Better Poker Planning
                        </h1>
                    </div>
                    <h1>{router.query.routeName}</h1>
                </div>
                <div className='flex flex-row'>
                    <a
                        href='https://github.com/Xalisse/better-poker-planning'
                        className='!cursor-pointer px-2'
                    >
                        Github
                    </a>
                </div>
            </header>
            <main className={`${comfortaa.className} w-full flex-1`}>
                {children}
            </main>
        </div>
    )
}

export default Layout

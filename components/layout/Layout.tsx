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
            <header className='p-2 w-full flex flex-row items-center justify-between'>
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
            </header>
            <main className={`${comfortaa.className} w-full flex-1`}>
                {children}
            </main>
            <footer className='fixed w-full bg-extra-light-secondary border-t bottom-0 right-0 flex flex-row justify-center items-center h-[40px]'>
                Made with 💖 by{' '}
                <a
                    href='https://github.com/Xalisse'
                    className='!cursor-pointer px-2'
                >
                    Valentine
                </a>
            </footer>
        </div>
    )
}

export default Layout

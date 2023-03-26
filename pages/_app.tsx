import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { Comfortaa } from '@next/font/google'
import { Toaster } from 'sonner'
import router from 'next/router'
import { SessionProvider } from 'next-auth/react'
import Header from '@/components/Header'

const comfortaa = Comfortaa({
    subsets: ['latin'],
    variable: '--comfortaa-font',
})

export default function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}: any) {
    return (
        <>
            <style jsx global>
                {`
                    :root {
                        --comfortaa-font: ${comfortaa.style.fontFamily};
                    }
                `}
            </style>
            <SessionProvider session={session}>
                <div className='grid grid-rows-[60px,1fr,40px] items-center h-full w-full'>
                    <Header />
                    <main className='w-full h-full overflow-y-auto overflow-x-hidden'>
                        <Component {...pageProps} />
                        <Toaster />
                    </main>
                    <footer className='w-full flex flex-row justify-center items-center h-10 border-t'>
                        Made with 💖 by{' '}
                        <a
                            href='https://github.com/Xalisse'
                            className='!cursor-pointer px-1'
                        >
                            Valentine
                        </a>
                    </footer>
                </div>
            </SessionProvider>
        </>
    )
}

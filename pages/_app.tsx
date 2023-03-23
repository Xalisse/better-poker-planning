import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { Comfortaa } from '@next/font/google'
import { Toaster } from 'sonner'

const comfortaa = Comfortaa({
    subsets: ['latin'],
    variable: '--comfortaa-font',
})

export default function MyApp({ Component, pageProps }: any) {
    return (
        <>
            <style jsx global>
                {`
                    :root {
                        --comfortaa-font: ${comfortaa.style.fontFamily};
                    }
                `}
            </style>
            <div className='flex flex-col justify-between items-center h-full w-full'>
                <main
                    className={`${comfortaa.className} w-full max-h-[75vh] overflow-y-auto overflow-x-hidden`}
                >
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
        </>
    )
}

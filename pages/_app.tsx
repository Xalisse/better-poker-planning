import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { Comfortaa } from '@next/font/google'
import { Toaster } from 'sonner'

const conmfortaa = Comfortaa({ subsets: ['latin'] })

export default function MyApp({ Component, pageProps }: any) {
    return <main className={`${conmfortaa.className} h-full`}>
        <Component {...pageProps} />
        <Toaster />
    </main>
}

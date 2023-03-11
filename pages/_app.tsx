import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { Comfortaa } from '@next/font/google'

const conmfortaa = Comfortaa({ subsets: ['latin'] })

export default function MyApp({ Component, pageProps }: any) {
    return <main className={conmfortaa.className}><Component {...pageProps} /></main>
}

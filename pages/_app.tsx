import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { Comfortaa } from 'next/font/google'
import { Toaster } from 'sonner'
import Layout from '@/components/layout/Layout'

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

            <Layout
                className={`w-full h-full flex flex-col justify-between ${comfortaa.className}`}
            >
                <Component {...pageProps} />
            </Layout>
            <Toaster />
        </>
    )
}

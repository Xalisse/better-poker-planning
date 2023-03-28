import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
    runtime: 'edge',
}

export default function handler(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const hasTitle = searchParams.has('title')

    const appName = 'Better Poker Planning'
    const roomName = hasTitle && searchParams.get('title')?.slice(0, 100)

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    fontWeight: 'bold',
                }}
            >
                <div tw='flex flex-col w-full h-full items-center justify-center bg-white'>
                    <div tw='bg-orange-50 flex w-full'>
                        <div tw='flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8'>
                            <h2 tw='flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-purple-950 text-left'>
                                {roomName && (
                                    <span>Rejoindre la salle {roomName}</span>
                                )}
                                <span tw='text-orange-600'>{appName}</span>
                            </h2>
                            <div tw='mt-8 flex md:mt-0'>
                                <div tw='flex rounded-md shadow'>
                                    <a tw='flex items-center justify-center rounded-md border border-transparent bg-orange-600 px-5 py-3 text-base font-medium text-white'>
                                        {roomName
                                            ? 'Rejoindre'
                                            : 'Créer une salle'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width: 800,
            height: 400,
        }
    )
}

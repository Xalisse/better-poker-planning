import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
    active: boolean
    domNode: any
    children: React.ReactNode
}
const Popup = ({ active, domNode, children }: Props) => {
    const [isVisible, setIsVisible] = useState(active)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsVisible(false)
        }, 1500)

        return () => clearTimeout(timeout)
    })

    return isVisible
        ? createPortal(
              <div className='absolute bg-black bg-opacity-70 text-white w-full h-full top-0 left-0 flex justify-center items-center'>
                  {children}
              </div>,
              domNode
          )
        : null
}

export default Popup

import React from 'react'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const font = Poppins({
    subsets: ['latin'],
    weight: ['400', '600'],
})
const Logo = () => {
    return (
        <div className='flex items-center w-full p-3 bg-background z-50'>
            <Image src='/m-dark.svg' alt='Logo' width="20" height="20" />
            <p className={cn("font-semibold pl-2", font.className)}>
                Motion
            </p>

        </div>
    )
}

export default Logo
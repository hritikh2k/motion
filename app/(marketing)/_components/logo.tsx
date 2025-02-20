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
        <div className='hidden md:flex items-center p-3 bg-background z-50 dark:bg-[#1F1F1F]'>
            <Image src='/m-dark.svg' alt='Logo' width="20" height="20" className='dark:hidden' />

            <Image src='/m-light.svg' alt='Logo' width="20" height="20" className='hidden dark:block' />
            <p className={cn("font-semibold pl-2", font.className)}>
                Motion
            </p>
        </div>
    )
}

export default Logo
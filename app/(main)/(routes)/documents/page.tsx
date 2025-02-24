"use client"
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const page = () => {
    const { user } = useUser();
    return (
        <div className='flex h-full flex-col items-center justify-center space-y-4'>
            <Image className='dark:hidden' src='/action-dark.png' alt='empty' width={400} height={400} />
            <Image className='hidden dark:block' src='/action-light.png' alt='empty' width={400} height={400} />

            <h1 className='font-bold'>Welcome to {user?.firstName}'s Motion </h1>
            <Button><PlusCircle />Create notes</Button>

        </div>
    )
}

export default page
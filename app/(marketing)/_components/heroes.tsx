'use client'
import Image from 'next/image'
import React from 'react'

const Heroes = () => {
    return (
        <div className='flex flex-col items-center justify-center max-w-5xl mx-auto'>
            <div className='flex items-center'>

                <div>
                    <Image src='/think-dark.png' alt='Hero 1' width={400} height={400}
                        className='dark:hidden' />
                    <Image src='/think-light.png' alt='Hero 1' width={400} height={400}
                        className='hidden dark:block' />
                </div>
                <div className='hidden md:block'>
                    <Image src='/CoffeeMan-dark.png' alt='Hero 2' width={400} height={400}
                        className='dark:hidden' />

                    <Image src='/CoffeeMan-light.png' alt='Hero 2' width={400} height={400}
                        className='hidden dark:block' />
                </div>


            </div>
        </div>
    )
}

export default Heroes
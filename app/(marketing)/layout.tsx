import React from 'react'
import Navbar from './_components/navbar'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-full dark:bg-[#1F1F1F]'>
            <Navbar />
            <main className='h-full p-20'>
                {children}
            </main>
        </div>
    )
}

export default layout
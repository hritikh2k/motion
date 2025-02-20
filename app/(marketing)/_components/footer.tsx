import React from 'react'
import Logo from './logo'


const Footer = () => {
    return (
        <div className='fixed items-center w-full p-6 bg-background z-50 bottom-0 hidden md:flex'>
            <Logo />
        </div>
    )
}

export default Footer
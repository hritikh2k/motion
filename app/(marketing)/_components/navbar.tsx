'use client';
import useScrollTop from '@/hooks/useScrollTop';
import { cn } from '@/lib/utils';
import React from 'react'
import Logo from './logo';
import { ModeToggle } from '@/components/themeToggleButton';

const Navbar = () => {
    const scrolled = useScrollTop();
    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-4 transition-all",
            scrolled ? "shadow-sm" : "shadow-none"
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2 ">
                <ModeToggle />
            </div>
        </div>
    )
}

export default Navbar
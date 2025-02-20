'use client';
import useScrollTop from '@/hooks/useScrollTop';
import { cn } from '@/lib/utils';
import React from 'react'
import Logo from './logo';
import { ModeToggle } from '@/components/themeToggleButton';
import { useConvexAuth } from 'convex/react';
import { SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/spinner';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const scrolled = useScrollTop();
    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-4 transition-all flex-row",
            scrolled ? "shadow-sm" : "shadow-none"
        )}>
            <div className="hidden md:flex">
                <Logo />
            </div>
            <div className="flex flex-1 items-center justify-between md:justify-end gap-x-2">
                {isLoading && (
                    <Spinner />
                )}
                {!isLoading && !isAuthenticated && (
                    <SignInButton>
                        <Button>
                            Log in
                        </Button>
                    </SignInButton>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                        <Button asChild className="md:order-1 order-2">
                            <Link href="/documents">
                                Enter Motion <ArrowRight />
                            </Link>
                        </Button>
                        <div className='flex items-center justify-end order-3'>
                            <div className='flex items-center gap-x-2 pr-2'>

                                <UserButton />
                            </div>

                        </div>
                    </>
                )}
            </div>
            <div className='flex items-center gap-x-2 pl-2'>
                <ModeToggle />
            </div>
        </div>
    )
}

export default Navbar
'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useConvexAuth } from 'convex/react'
import Spinner from '@/components/spinner'
import { SignInButton } from '@clerk/clerk-react'

const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth()
    return (
        <div className='max-w-3xl space-y-4'>
            <h1 className='font-bold text-center text-3xl sm:text-5xl md:text-6xl'>Your ideas, documents, and plans. Together. Welcome to <span className='underline'>Motion</span></h1>
            <h3 className='text-base sm:text-xl md:text-2xl font-medium '>
                Motion is the connected workspace where <br />
                better, faster work happens.
            </h3>
            <div className='w-full flex items-center justify-center'>
                {isLoading && (
                    <Spinner />
                )}
            </div>
            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href="/documents">
                        Enter Motion <ArrowRight />
                    </Link>
                </Button>
            )}
            {!isAuthenticated && !isLoading && (
                <SignInButton>
                    <Button>
                        Login to Motion <ArrowRight />
                    </Button>
                </SignInButton>
            )}
        </div>
    )
}

export default Heading
"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const error = () => {
    return (
        <div className='h-full flex flex-col items-center justify-center space-y-4'>
            <p className='text-4xl pt-[300px] pb-5'>Error! Something went wrong</p>
            <Image src='/error.jpeg'
                height='300'
                width='400'
                alt='error'
            />
            <Button asChild variant='default' className='rounded-full'>
                <Link href="/documents">
                    Go back
                </Link>
            </Button>
        </div>
    )
}

export default error
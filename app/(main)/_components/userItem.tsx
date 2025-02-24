"use client"
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SignOutButton, useUser } from '@clerk/clerk-react';
import { ChevronsLeftRight, LogOut } from 'lucide-react';
import React from 'react';

const UserItem = () => {
    const { user } = useUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div
                    role='button'
                    className='group flex items-center text-sm p-3 w-full hover:bg-primary/5'>
                    <div className='gap-x-2 flex items-center max-w-[150px]'>
                        <Avatar className='h-6 w-6'>
                            <AvatarImage src={user?.imageUrl} />
                        </Avatar>
                        <span className='text-start font-medium line-clamp-1'>
                            {user?.firstName}'s Motion
                        </span>
                    </div>
                    <div></div>
                    <ChevronsLeftRight className='rotate-90 bg-transparent text-muted-foreground h-4 w-4 group-hover:text-white transition-colors duration-200' />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className='w-80'
                align='start'
                alignOffset={11}
                forceMount>
                <div className='flex flex-col space-y-4 p-2'>
                    <p className='text-xs font-medium leading-none text-muted-foreground'>
                        {user?.emailAddresses[0].emailAddress}
                    </p>
                    <div className='flex items-center gap-x-2'>
                        <div className='rounded-md bg-secondary p-1'>
                            <Avatar>
                                <AvatarImage src={user?.imageUrl} />
                            </Avatar>
                        </div>
                        <div>
                            <p>
                                {user?.fullName}
                            </p>
                        </div>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className='text-muted-foreground w-full cursor-pointer '>
                    <SignOutButton><div className='h-4 w-4'><LogOut /> Log out</div></SignOutButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserItem;
'use client'
import { cn } from '@/lib/utils';
import { ChevronsLeft, MenuIcon } from 'lucide-react'
import { usePathname } from 'next/navigation';
import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts';
import UserItem from './userItem';

const Navigation = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const pathname = usePathname();
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<HTMLElement>(null);
    const navbarRef = useRef<HTMLDivElement>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    useEffect(() => {
        if (isMobile) {
            handleCollaps();
        } else {
            handleResetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            handleCollaps();
        }
    }, [pathname, isMobile]);

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation()
        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }
    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWidth = event.clientX;
        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;
        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
        }
    }
    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }

    const handleResetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);
            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
            navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
            setTimeout(() => setIsResetting(false), 300);
        }
    }

    const handleCollaps = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);
            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("left", "0");
            navbarRef.current.style.setProperty("width", "100%");
            setTimeout(() => setIsResetting(false), 300);
        }
    }


    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn('group/sidebar h-full bg-secondary  overflow-y-auto relative flex w-60 flex-col z-[99999]',
                    isMobile && "w-0 overflow-hidden",
                    isResetting && "transition-all duration-300 ease-in-out"
                )}>
                <div role='button'
                    onClick={handleCollaps}
                    className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100",
                        isMobile && "opacity-100"
                    )}>
                    <ChevronsLeft className='h-6 w-6' />
                </div>
                <div>
                    <UserItem />
                </div>
                <div className='pt-4'>
                    <p>
                        Documents
                    </p>

                </div>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={handleResetWidth}
                    className='opacity group-hover/sidebar:opacity-100 cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0' />
            </aside>
            <div
                ref={navbarRef}
                className={cn('absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
                    isResetting && "transition-all duration-300 ease-in-out",
                    isMobile && "left-0 w-full"
                )}>
                <nav
                    onClick={handleResetWidth}
                    className="bg-transparent px-3 py-2 w-full ">
                    {isCollapsed && <MenuIcon role='button' className="w-6 h-6 text-muted-foreground" />}
                </nav>
            </div>
        </>
    )
}

export default Navigation 
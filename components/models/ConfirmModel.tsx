"use client"
import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

interface confirmModelProps {
    children: React.ReactNode,
    onConfirm: () => void;
}

export const ConfirmModel = ({
    children,
    onConfirm
}: confirmModelProps) => {
    const handleConfirm = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation()
        onConfirm();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger onClick={(event) => { event.stopPropagation() }} asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you want to delete this?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will permanently delete the file.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => { e.stopPropagation() }}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
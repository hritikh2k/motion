import { ConfirmModel } from '@/components/models/ConfirmModel'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

interface BannerProps {
    documentId: Id<'documents'>
}
export const Banner = ({
    documentId
}: BannerProps) => {
    const router = useRouter();
    const remove = useMutation(api.documents.removeFile);
    const restore = useMutation(api.documents.restore);
    const onRemove = () => {
        const promise = remove({ id: documentId })
        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Deleted successfully",
            error: "Failed to delete note"
        })
        router.push('/documents');
    };

    const onRestore = () => {
        const promise = restore({ id: documentId })
        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Restore successfully",
            error: "Failed to restore note"
        })
    };

    return (
        <div className='w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center'>
            <p>
                This page is in trash.
            </p>
            <Button
                onClick={onRestore}
                size='sm'
                variant='outline'
                className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal'
            >
                Restore
            </Button>
            <ConfirmModel
                onConfirm={onRemove}
            >
                <Button
                    size='sm'
                    variant='outline'
                    className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal'
                >
                    Delele
                </Button>
            </ConfirmModel>
        </div>
    )
}

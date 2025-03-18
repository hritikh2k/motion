import { ConfirmModel } from '@/components/models/ConfirmModel'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import { useEdgeStore } from '@/lib/edgestore';

interface BannerProps {
    documentId: Id<'documents'>
    coverImageUrl: any
}

export const Banner = ({
    documentId,
    coverImageUrl
}: BannerProps) => {
    const router = useRouter();
    const remove = useMutation(api.documents.removeFile);
    const restore = useMutation(api.documents.restore);
    const { edgestore } = useEdgeStore();

    const onRemove = async () => {
        try {
            // Delete the cover image from EdgeStore
            if (coverImageUrl) {
                await edgestore.publicFiles.delete({ url: coverImageUrl });
            }

            // Delete the document
            const promise = remove({ id: documentId });
            toast.promise(promise, {
                loading: "Deleting note...",
                success: "Deleted successfully",
                error: "Failed to delete note"
            });

            router.push('/documents');
        } catch (error) {
            console.error("Failed to delete cover image or document:", error);
            toast.error("Failed to delete cover image or document");
        }
    };

    const onRestore = () => {
        const promise = restore({ id: documentId });
        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Restore successfully",
            error: "Failed to restore note"
        });
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
                    Delete
                </Button>
            </ConfirmModel>
        </div>
    )
}

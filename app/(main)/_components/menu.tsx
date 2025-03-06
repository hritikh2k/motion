"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/clerk-react"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { useMutation } from "convex/react"
import { Ghost, MoreHorizontal, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface MenuProps {
    documentId: Id<'documents'>
}
export const Menu = ({
    documentId
}: MenuProps) => {
    const router = useRouter();
    const { user } = useUser();
    const archive = useMutation(api.documents.archive);

    const onArchive = () => {
        const promise = archive({ id: documentId });
        toast.promise(promise, {
            loading: "Deleting the file",
            success: "File Deleted",
            error: "Something went wrong"
        });
        router.push("/documents")
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant='ghost' >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-60"
                align="end"
                alignOffset={8}
                forceMount>
                <DropdownMenuItem onClick={onArchive} className="flex gap-2 text-sm">
                    <Trash role="button" className="h-4 w-4 mt-[0.5px]" />Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-sm text-muted-foreground">
                    Last Edited by :{user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

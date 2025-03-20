"use client";
import { ConfirmModel } from "@/components/models/ConfirmModel";
import Spinner from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const TrashBox = () => {
  const router = useRouter();
  const param = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.removeFile);
  const [search, setSearch] = useState("");
  const { edgestore } = useEdgeStore();

  const filterDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">,
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring File",
      success: "Restore successfully",
      error: "Something went wrong",
    });
  };

  const onRemove = async (documentId: Id<"documents">, coverImage: any) => {
    try {
      // Delete the cover image from EdgeStore
      if (coverImage) {
        await edgestore.publicFiles.delete({ url: coverImage });
      }

      // Delete the document
      const promise = remove({ id: documentId });
      toast.promise(promise, {
        loading: "Deleting File",
        success: "Deleted successfully",
        error: "Something went wrong",
      });

      if (param.documentId === documentId) {
        router.push("/documents");
      }
    } catch (error) {
      console.error("Failed to delete cover image or document:", error);
      toast.error("Failed to delete cover image or document");
    }
  };

  if (documents === undefined) {
    return (
      <div className="flex h-full item-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex item-center gap-x-1 p-2">
        <Search className="h-4 w-4 mt-1" />
        <Input
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Filter by page title"
          value={search}
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block pb-2 text-sm text-center text-muted-foreground">
          No Document found
        </p>
        {filterDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => {
              onClick(document._id);
            }}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => {
                  onRestore(e, document._id);
                }}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModel
                onConfirm={() => {
                  onRemove(document._id, document.coverImage);
                }}
              >
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModel>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;

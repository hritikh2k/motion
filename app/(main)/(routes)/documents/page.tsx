"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

const page = () => {
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreateHandler = () => {
    const promise = create({ title: "Untitiled" });
    toast.promise(promise, {
      loading: "Creating document",
      success: "Created successfully",
      error: "Something went wrong ",
    });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image
        className="dark:hidden"
        src="/action-dark.png"
        alt="empty"
        width={400}
        height={400}
      />
      <Image
        className="hidden dark:block"
        src="/action-light.png"
        alt="empty"
        width={400}
        height={400}
      />

      <h1 className="font-bold">Welcome to {user?.firstName}'s Motion </h1>
      <Button onClick={onCreateHandler}>
        <PlusCircle />
        Create notes
      </Button>
    </div>
  );
};

export default page;

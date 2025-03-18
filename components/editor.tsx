'use client'
import React, { useCallback } from 'react'
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { useTheme } from 'next-themes';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react"
import { useEdgeStore } from '../lib/edgestore'; // Adjust the import path as needed

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
}

export const Editor = ({
    onChange,
    initialContent,
    editable = true
}: EditorProps) => {
    const { theme: appTheme } = useTheme();
    const { edgestore } = useEdgeStore();

    // Keep track of uploaded file URLs for cleanup
    const [uploadedFileUrls, setUploadedFileUrls] = React.useState<Set<string>>(new Set());

    // Parse initial content with error handling
    let parsedContent: PartialBlock[] | undefined;
    try {
        parsedContent = initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined;
    } catch (error) {
        console.error("Invalid initialContent JSON:", error);
        parsedContent = undefined;
    }

    // Function to handle file uploads
    const handleUpload = useCallback(async (file: File) => {
        try {
            const response = await edgestore.publicFiles.upload({
                file
            });

            // Store the URL of the uploaded file
            setUploadedFileUrls(prev => new Set(prev).add(response.url));

            return response.url;
        } catch (error) {
            console.error("File upload failed:", error);
            throw error;
        }
    }, [edgestore]);

    // Create BlockNote editor instance with file upload capability
    const editor = useCreateBlockNote({
        // editable: editable,
        initialContent: parsedContent,
        uploadFile: handleUpload
    });

    // Track files that are no longer in the editor content
    React.useEffect(() => {
        if (!editor || !onChange) return;

        const unsubscribe = editor.onChange(() => {
            // Get the current editor content as blocks
            const blocks = editor.topLevelBlocks;
            const content = JSON.stringify(blocks);

            // Pass content to parent component
            onChange(content);

            // Find all file URLs in the current content
            const fileUrlRegex = /(https?:\/\/.*?\.(png|jpg|jpeg|gif|webp|mp4|pdf|doc|docx))/gi;
            const currentUrls = new Set<string>();
            let match;

            while ((match = fileUrlRegex.exec(content)) !== null) {
                currentUrls.add(match[1]);
            }

            // Delete files that were uploaded but are no longer in the content
            uploadedFileUrls.forEach(url => {
                if (!currentUrls.has(url)) {
                    // Delete the file from EdgeStore
                    edgestore.publicFiles.delete({
                        url: url
                    }).catch(error => {
                        console.error("Failed to delete file:", error);
                    });

                    // Remove the URL from our tracking set
                    setUploadedFileUrls(prev => {
                        const updated = new Set(prev);
                        updated.delete(url);
                        return updated;
                    });
                }
            });
        });

        return unsubscribe;
    }, [editor, onChange, edgestore, uploadedFileUrls]);

    return (
        <BlockNoteView
            editor={editor}
            theme={appTheme === 'dark' ? 'dark' : 'light'}
        />
    );
}
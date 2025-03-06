"use client"
import { Doc } from '@/convex/_generated/dataModel'
import React from 'react'

interface titleProps {
    initialData: Doc<'documents'>
}

export const Title = ({
    initialData
}: titleProps) => {
    return (
        <div>Title</div>
    )
}

'use client'

import React, { useEffect, useState } from 'react'
import { SettingsModel } from '../models/SettingsModel';

export const ModelProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return null;
    }

    return (
        <>
            <SettingsModel />
        </>
    )
}

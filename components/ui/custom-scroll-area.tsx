'use client';
import React, { forwardRef } from 'react';

interface CustomScrollAreaProps {
    className?: string;
    children: React.ReactNode;
}

const CustomScrollArea = forwardRef<HTMLDivElement, CustomScrollAreaProps>(
    ({ className = '', children }, ref) => {
        return (
            <div ref={ref} className={`overflow-y-auto ${className}`}>
                {children}
            </div>
        );
    }
);

CustomScrollArea.displayName = 'CustomScrollArea';

export { CustomScrollArea };
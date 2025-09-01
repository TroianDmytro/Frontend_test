// src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md'
}) => {
    const paddings = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div className={`bg-cabinet-black border border-gray-700 rounded-lg ${paddings[padding]} ${className}`}>
            {children}
        </div>
    );
};
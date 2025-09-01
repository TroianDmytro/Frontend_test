// src/components/admin/StatsCard.tsx
import React from 'react';
import type { LucideProps } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<LucideProps>;
    color?: string;
    change?: {
        value: number;
        period: string;
    };
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    color = 'text-cabinet-blue',
    change,
    className = ''
}) => {
    const isPositive = change && change.value > 0;
    const isNegative = change && change.value < 0;

    return (
        <div className={`bg-cabinet-black border border-gray-700 rounded-lg p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-800 ${color.replace('text-', 'bg-').replace('-500', '-500/20')}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>

            {change && (
                <div className="flex items-center gap-2">
                    {isPositive && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {isNegative && <TrendingDown className="w-4 h-4 text-red-500" />}
                    <span className={`text-sm font-medium ${isPositive ? 'text-green-500' :
                            isNegative ? 'text-red-500' :
                                'text-gray-400'
                        }`}>
                        {change.value > 0 ? '+' : ''}{change.value}%
                    </span>
                    <span className="text-gray-400 text-sm">за {change.period}</span>
                </div>
            )}
        </div>
    );
};
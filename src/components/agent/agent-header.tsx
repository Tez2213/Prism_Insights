'use client';

import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentHeaderProps {
    name: string;
    description: string;
    status: 'active' | 'processing' | 'idle' | 'error';
    icon: LucideIcon;
    color: string;
}

export function AgentHeader({ name, description, status, icon: Icon, color }: AgentHeaderProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'idle':
                return 'bg-gray-100 text-gray-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex items-start gap-4 mb-8">
            <div className={cn('flex h-16 w-16 items-center justify-center rounded-lg', color)}>
                <Icon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
                    <Badge className={getStatusColor(status)}>{status}</Badge>
                </div>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
}
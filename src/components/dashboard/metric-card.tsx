'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, LucideIcon, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  format?: 'currency' | 'percentage' | 'number';
  tooltip?: string;
  calculation?: string;
}

export function MetricCard({
  label,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  format = 'number',
  tooltip,
  calculation,
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-600">{label}</p>
              {(tooltip || calculation) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-2">
                        {tooltip && (
                          <p className="text-sm">{tooltip}</p>
                        )}
                        {calculation && (
                          <p className="text-xs text-gray-400 border-t pt-2">
                            <span className="font-medium">Calculation: </span>
                            {calculation}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
            {change !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                    getTrendColor()
                  )}
                >
                  {getTrendIcon()}
                  {Math.abs(change)}%
                </span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

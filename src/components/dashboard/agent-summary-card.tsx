'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Agent, Metric } from '@/types';
import { Sparkline } from '@/components/charts/sparkline';

interface AgentSummaryCardProps {
  agent: Agent;
  metrics: Metric[];
  href: string;
  icon: LucideIcon;
  chartData?: number[];
  chartColor?: string;
}

export function AgentSummaryCard({
  agent,
  metrics,
  href,
  icon: Icon,
  chartData,
  chartColor,
}: AgentSummaryCardProps) {
  const getStatusColor = (status: Agent['status']) => {
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

  const formatMetricValue = (metric: Metric) => {
    if (typeof metric.value === 'string') return metric.value;

    switch (metric.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(metric.value);
      case 'percentage':
        return `${metric.value}%`;
      default:
        return metric.value.toLocaleString();
    }
  };

  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', agent.color)}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <Badge className={cn('mt-1', getStatusColor(agent.status))}>
                {agent.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData && chartData.length > 0 && (
          <div className="mb-4 -mx-2">
            <Sparkline data={chartData} color={chartColor} height={50} />
          </div>
        )}
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{metric.label}</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatMetricValue(metric)}
              </span>
            </div>
          ))}
        </div>
        <Link href={href}>
          <Button variant="outline" className="mt-4 w-full">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
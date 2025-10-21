'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { FloatingChat } from '@/components/agent/floating-chat';
import { MetricCard } from '@/components/dashboard/metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkeletonDashboard } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableHeaderWithTooltip } from '@/components/ui/table-header-with-tooltip';
import { Target, DollarSign, TrendingUp, Users } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { BarChart } from '@/components/charts/bar-chart';
import { LineChart } from '@/components/charts/line-chart';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function SalesPipelinePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiClient.getLeads();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'qualified':
        return 'bg-purple-100 text-purple-800';
      case 'proposal':
        return 'bg-yellow-100 text-yellow-800';
      case 'negotiation':
        return 'bg-orange-100 text-orange-800';
      case 'closed-won':
        return 'bg-green-100 text-green-800';
      case 'closed-lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
  const avgScore = leads.reduce((sum, lead) => sum + lead.aiScore, 0) / leads.length;
  const avgConversion = leads.reduce((sum, lead) => sum + lead.conversionProbability, 0) / leads.length;
  const qualifiedLeads = leads.filter((l) => l.status !== 'new').length;

  // Pipeline funnel data
  const pipelineStages = [
    { stage: 'New', count: leads.filter(l => l.status === 'new').length, value: leads.filter(l => l.status === 'new').reduce((sum, l) => sum + l.estimatedValue, 0) },
    { stage: 'Qualified', count: leads.filter(l => l.status === 'qualified').length, value: leads.filter(l => l.status === 'qualified').reduce((sum, l) => sum + l.estimatedValue, 0) },
    { stage: 'Proposal', count: leads.filter(l => l.status === 'proposal').length, value: leads.filter(l => l.status === 'proposal').reduce((sum, l) => sum + l.estimatedValue, 0) },
    { stage: 'Negotiation', count: leads.filter(l => l.status === 'negotiation').length, value: leads.filter(l => l.status === 'negotiation').reduce((sum, l) => sum + l.estimatedValue, 0) },
    { stage: 'Closed Won', count: leads.filter(l => l.status === 'closed-won').length, value: leads.filter(l => l.status === 'closed-won').reduce((sum, l) => sum + l.estimatedValue, 0) },
  ];

  // Calculate conversion rates
  const pipelineWithConversion = pipelineStages.map((stage, index) => {
    const conversionRate = index > 0 && pipelineStages[index - 1].count > 0
      ? ((stage.count / pipelineStages[index - 1].count) * 100).toFixed(1)
      : '100.0';
    return {
      ...stage,
      conversionRate: `${conversionRate}%`,
      valueInK: Math.round(stage.value / 1000),
    };
  });

  // Revenue forecast data (next 6 months)
  const currentMonth = new Date().getMonth();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const revenueForecast = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth + i) % 12;
    const baseRevenue = totalValue * (0.15 + i * 0.05); // Growing forecast
    const optimistic = baseRevenue * 1.2;
    const pessimistic = baseRevenue * 0.8;
    
    return {
      month: months[monthIndex],
      projected: Math.round(baseRevenue / 1000),
      optimistic: Math.round(optimistic / 1000),
      pessimistic: Math.round(pessimistic / 1000),
    };
  });

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sales Pipeline Optimization' },
  ];

  if (isLoading) {
    return (
      <div>
        <DashboardHeader
          title="Sales Pipeline Optimization"
          description="AI-powered lead scoring and pipeline management"
          alerts={[]}
        />
        <div className="p-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Sales Pipeline Optimization"
        description="AI-powered lead scoring and pipeline management"
        alerts={[]}
      />

      <div className="p-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            label="Pipeline Value"
            value={totalValue}
            format="currency"
            change={15.3}
            trend="up"
            icon={DollarSign}
            tooltip="Total potential revenue from all active leads in the sales pipeline"
            calculation="Sum of all lead values across all stages"
          />
          <MetricCard
            label="Active Leads"
            value={leads.length}
            format="number"
            change={8}
            trend="up"
            icon={Users}
            tooltip="Number of leads currently being pursued across all pipeline stages"
            calculation="Count of all leads with status != 'closed'"
          />
          <MetricCard
            label="Avg AI Score"
            value={avgScore.toFixed(0)}
            format="number"
            icon={Target}
            tooltip="Average AI-generated lead quality score based on multiple factors"
            calculation="Average of all lead AI scores (0-100 scale)"
          />
          <MetricCard
            label="Avg Conversion"
            value={avgConversion.toFixed(0)}
            format="percentage"
            change={3.5}
            trend="up"
            icon={TrendingUp}
            tooltip="Average probability of converting leads to closed deals"
            calculation="Average of all lead conversion probabilities"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={pipelineWithConversion}
                dataKeys={['count']}
                xAxisKey="stage"
                height={300}
                colors={['hsl(var(--chart-1))']}
                yAxisLabel="Number of Leads"
              />
              <div className="mt-4 space-y-2">
                {pipelineWithConversion.map((stage, index) => (
                  index > 0 && (
                    <div key={stage.stage} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {pipelineStages[index - 1].stage} → {stage.stage}
                      </span>
                      <span className="font-medium">{stage.conversionRate}</span>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={revenueForecast}
                dataKeys={['projected', 'optimistic', 'pessimistic']}
                xAxisKey="month"
                height={300}
                colors={['hsl(var(--chart-1))', 'hsl(var(--chart-3))', 'hsl(var(--chart-5))']}
                yAxisLabel="Revenue ($K)"
              />
              <div className="mt-4 flex justify-around text-sm">
                <div className="text-center">
                  <div className="text-muted-foreground">Pessimistic</div>
                  <div className="font-medium text-red-600">
                    ${revenueForecast[5].pessimistic}K
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Projected</div>
                  <div className="font-medium">
                    ${revenueForecast[5].projected}K
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Optimistic</div>
                  <div className="font-medium text-green-600">
                    ${revenueForecast[5].optimistic}K
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lead Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderWithTooltip 
                    tooltip="Prospect company name"
                    sortable
                  >
                    Company
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    tooltip="Primary contact person name and email"
                    sortable
                  >
                    Contact
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    tooltip="Industry sector or vertical market of the prospect"
                    sortable
                  >
                    Industry
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    className="text-right"
                    tooltip="Estimated deal value or annual contract value"
                    sortable
                  >
                    Est. Value
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    className="text-right"
                    tooltip="AI-generated lead quality score (0-100) based on engagement, fit, and behavior"
                    sortable
                  >
                    AI Score
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    className="text-right"
                    tooltip="Predicted probability of converting this lead to a closed deal"
                    sortable
                  >
                    Conversion
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    tooltip="Current stage in the sales pipeline"
                    sortable
                  >
                    Status
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    tooltip="Lead source or acquisition channel"
                    sortable
                  >
                    Source
                  </TableHeaderWithTooltip>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{lead.companyName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{lead.contactName}</p>
                        <p className="text-xs text-gray-500">{lead.contactEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{lead.industry}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${lead.estimatedValue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        'inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold',
                        getScoreColor(lead.aiScore)
                      )}>
                        {lead.aiScore}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {lead.conversionProbability}%
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{lead.source}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <FloatingChat agentName="Sales Pipeline Optimization" agentType="sales-pipeline" />
      </div>
    </div>
  );
}

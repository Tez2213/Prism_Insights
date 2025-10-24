'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { FloatingChat } from '@/components/agent/floating-chat';
import { ClientDetailModal } from '@/components/agent/client-detail-modal';
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
import { LineChart } from '@/components/charts/line-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { TrendingUp, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { simulatorClient } from '@/lib/api/simulator-client';
import type { Client } from '@/types';

export default function ClientProfitabilityPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await simulatorClient.getClients();
        // Transform simulator data to match Client type
        const transformedData = data.map((client: any) => ({
          id: client.id,
          companyName: client.name,
          industry: client.industry,
          monthlyRevenue: client.monthlyRecurring,
          monthlyCosts: client.annualCosts / 12,
          marginPercentage: ((client.annualRevenue - client.annualCosts) / client.annualRevenue) * 100,
          status: client.status.toLowerCase().replace(' ', '-'),
          churnRisk: client.churnRisk.toLowerCase(),
          employeeCount: client.employeeCount,
          contractValue: client.contractValue,
        }));
        setClients(transformedData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    }

    // Initial fetch
    fetchData();

    // Auto-refresh every 3 seconds
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Dynamic status calculation based on margin
  const calculateStatus = (marginPercentage: number) => {
    if (marginPercentage < 20) return 'at-risk';
    return 'active';
  };

  // Dynamic churn risk calculation based on margin
  const calculateChurnRisk = (marginPercentage: number) => {
    if (marginPercentage < 15) return 'high';
    if (marginPercentage < 25) return 'medium';
    return 'low';
  };

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-orange-100 text-orange-800';
      case 'churned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Sort clients by revenue (leaderboard style)
  const sortedClients = [...clients].sort((a, b) => b.monthlyRevenue - a.monthlyRevenue);

  const totalRevenue = clients.reduce((sum, client) => sum + client.monthlyRevenue, 0);
  const totalCosts = clients.reduce((sum, client) => sum + client.monthlyCosts, 0);
  const avgMargin = ((totalRevenue - totalCosts) / totalRevenue) * 100;
  const atRiskClients = clients.filter((c) => c.status === 'at-risk').length;

  // Generate mock historical profitability data for line chart
  const profitabilityTrendData = [
    { month: 'Jan', 'TechCorp Solutions': 26.5, 'DataSystems Inc': 36.2, 'CloudFirst Ltd': 24.8, 'SecureNet Group': 40.1 },
    { month: 'Feb', 'TechCorp Solutions': 27.2, 'DataSystems Inc': 37.5, 'CloudFirst Ltd': 25.1, 'SecureNet Group': 41.2 },
    { month: 'Mar', 'TechCorp Solutions': 26.8, 'DataSystems Inc': 38.1, 'CloudFirst Ltd': 25.9, 'SecureNet Group': 41.8 },
    { month: 'Apr', 'TechCorp Solutions': 27.9, 'DataSystems Inc': 37.8, 'CloudFirst Ltd': 26.2, 'SecureNet Group': 42.0 },
    { month: 'May', 'TechCorp Solutions': 28.3, 'DataSystems Inc': 38.3, 'CloudFirst Ltd': 26.0, 'SecureNet Group': 42.1 },
    { month: 'Jun', 'TechCorp Solutions': 28.9, 'DataSystems Inc': 38.7, 'CloudFirst Ltd': 26.3, 'SecureNet Group': 42.3 },
  ];

  // Generate margin comparison data for bar chart (top 10)
  const marginComparisonData = sortedClients.slice(0, 10).map(client => ({
    name: client.companyName.split(' ')[0], // Use first word for shorter labels
    margin: client.marginPercentage,
    fill: client.marginPercentage < 30 ? 'hsl(var(--destructive))' : 'hsl(var(--chart-1))',
  }));

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Client Profitability Intelligence' },
  ];

  if (isLoading) {
    return (
      <div>
        <DashboardHeader
          title="Client Profitability Intelligence"
          description="Real-time profitability analysis and optimization"
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
        title="Client Profitability Intelligence"
        description="Real-time profitability analysis and optimization"
        alerts={[]}
      />

      <div className="p-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            label="Total MRR"
            value={totalRevenue}
            format="currency"
            change={8.5}
            trend="up"
            icon={DollarSign}
            tooltip="Total Monthly Recurring Revenue across all active clients"
            calculation="Sum of all client MRR values"
          />
          <MetricCard
            label="Average Margin"
            value={avgMargin.toFixed(1)}
            format="percentage"
            change={2.3}
            trend="up"
            icon={TrendingUp}
            tooltip="Average profit margin across all clients, indicating overall profitability"
            calculation="(Total Revenue - Total Cost) / Total Revenue × 100"
          />
          <MetricCard
            label="Active Clients"
            value={clients.length}
            format="number"
            change={5}
            trend="up"
            icon={Users}
            tooltip="Number of clients with active contracts and recurring revenue"
            calculation="Count of clients with status = 'active'"
          />
          <MetricCard
            label="At-Risk Clients"
            value={atRiskClients}
            format="number"
            icon={AlertTriangle}
            tooltip="Clients with negative margins or declining profitability trends"
            calculation="Count of clients with margin < 0%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profitability Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={profitabilityTrendData}
                dataKeys={['TechCorp Solutions', 'DataSystems Inc', 'CloudFirst Ltd', 'SecureNet Group']}
                xAxisKey="month"
                height={300}
                yAxisLabel="Margin %"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Margin Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={marginComparisonData}
                dataKeys={['margin']}
                xAxisKey="name"
                height={300}
                yAxisLabel="Margin %"
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Profitability Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderWithTooltip
                      className="w-[200px]"
                      tooltip="Client company name"
                      sortable
                    >
                      Client
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip
                      className="w-[150px]"
                      tooltip="Industry sector or vertical market"
                      sortable
                    >
                      Industry
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip
                      className="text-right w-[120px]"
                      tooltip="Monthly Recurring Revenue - predictable revenue from this client each month"
                      sortable
                    >
                      MRR
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip
                      className="text-right w-[100px]"
                      tooltip="Profit margin percentage calculated as (Revenue - Cost) / Revenue × 100"
                      sortable
                    >
                      Margin
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip
                      className="w-[120px]"
                      tooltip="Current client relationship status (active, at-risk, or churned)"
                      sortable
                    >
                      Status
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip
                      className="w-[120px]"
                      tooltip="AI-predicted risk level of client canceling service (high, medium, or low)"
                      sortable
                    >
                      Churn Risk
                    </TableHeaderWithTooltip>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedClients.map((client, index) => {
                    const dynamicStatus = calculateStatus(client.marginPercentage);
                    const dynamicChurnRisk = calculateChurnRisk(client.marginPercentage);

                    return (
                      <TableRow
                        key={client.id}
                        className="cursor-pointer hover:bg-gray-50 transition-all duration-300"
                        onClick={() => handleClientClick(client)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-mono w-6">#{index + 1}</span>
                            {client.companyName}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{client.industry}</TableCell>
                        <TableCell className="text-right font-mono">
                          ${Math.round(client.monthlyRevenue).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium font-mono">
                          <span className={client.marginPercentage >= 30 ? 'text-green-600' : client.marginPercentage >= 20 ? 'text-yellow-600' : 'text-red-600'}>
                            {client.marginPercentage.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(dynamicStatus)}>
                            {dynamicStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getChurnRiskColor(dynamicChurnRisk)}>
                            {dynamicChurnRisk}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <ClientDetailModal
          client={selectedClient}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <FloatingChat agentName="Client Profitability Intelligence" agentType="client-profitability" />
      </div>
    </div>
  );
}

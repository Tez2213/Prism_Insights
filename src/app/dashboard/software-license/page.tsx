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
import { Key, DollarSign, TrendingDown, AlertCircle } from 'lucide-react';
import { simulatorClient } from '@/lib/api/simulator-client';
import { cn } from '@/lib/utils';
import { PieChart } from '@/components/charts/pie-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function SoftwareLicensePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [licenses, setLicenses] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await simulatorClient.getLicenses();
        // Transform simulator data to match expected format
        const transformedData = data.map((license: any) => ({
          id: license.id,
          vendor: license.vendor,
          product: license.product,
          quantity: license.totalLicenses,
          utilized: license.usedLicenses,
          utilizationRate: license.utilizationRate,
          monthlyCost: license.totalCost / 12,
          potentialSavings: (license.totalLicenses - license.usedLicenses) * (license.costPerLicense / 12),
          status: license.utilizationRate >= 90 ? 'optimal' : license.utilizationRate >= 70 ? 'underutilized' : 'overutilized',
        }));
        setLicenses(transformedData);
      } catch (error) {
        console.error('Error fetching licenses:', error);
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
  // Dynamic status calculation based on utilization
  const calculateStatus = (utilizationRate: number) => {
    if (utilizationRate >= 85) return 'optimal';
    if (utilizationRate >= 60) return 'underutilized';
    return 'overutilized';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 text-green-800';
      case 'underutilized':
        return 'bg-yellow-100 text-yellow-800';
      case 'overutilized':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Sort licenses by utilization rate (leaderboard style)
  const sortedLicenses = [...licenses].sort((a, b) => b.utilizationRate - a.utilizationRate);

  const totalLicenses = licenses.reduce((sum, license) => sum + license.quantity, 0);
  const totalUtilized = licenses.reduce((sum, license) => sum + license.utilized, 0);
  const avgUtilization = (totalUtilized / totalLicenses) * 100;
  const totalCost = licenses.reduce((sum, license) => sum + license.monthlyCost, 0);
  const totalSavings = licenses.reduce((sum, license) => sum + license.potentialSavings, 0);

  // Prepare data for license distribution pie chart
  const licenseDistributionData = licenses.map(license => ({
    name: license.vendor,
    value: license.quantity,
  }));

  // Prepare data for utilization rate bar chart
  const utilizationData = licenses.map(license => ({
    name: license.product,
    utilizationRate: license.utilizationRate,
  }));

  // Define colors for utilization based on rate
  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return 'hsl(142, 76%, 36%)'; // Green for high utilization
    if (rate >= 70) return 'hsl(48, 96%, 53%)'; // Yellow for medium utilization
    return 'hsl(0, 84%, 60%)'; // Red for low utilization
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Software License Intelligence' },
  ];

  if (isLoading) {
    return (
      <div>
        <DashboardHeader
          title="Software License Intelligence"
          description="Monitor license usage and identify cost-saving opportunities"
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
        title="Software License Intelligence"
        description="Monitor license usage and identify cost-saving opportunities"
        alerts={[]}
      />

      <div className="p-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            label="Total Licenses"
            value={totalLicenses}
            format="number"
            icon={Key}
            tooltip="Total number of software licenses across all vendors and products"
            calculation="Sum of all license quantities"
          />
          <MetricCard
            label="Utilization Rate"
            value={avgUtilization.toFixed(1)}
            format="percentage"
            change={-5.2}
            trend="down"
            icon={TrendingDown}
            tooltip="Average percentage of licenses actively being used across all software"
            calculation="(Total Active Users / Total Licenses) × 100"
          />
          <MetricCard
            label="Monthly Cost"
            value={totalCost}
            format="currency"
            icon={DollarSign}
            tooltip="Total monthly cost for all software licenses and subscriptions"
            calculation="Sum of all license monthly costs"
          />
          <MetricCard
            label="Potential Savings"
            value={totalSavings}
            format="currency"
            icon={AlertCircle}
            tooltip="Estimated savings from optimizing underutilized licenses and removing unused ones"
            calculation="Sum of (Unused Licenses × Cost per License)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>License Distribution by Vendor</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={licenseDistributionData}
                height={300}
                showLegend={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilization Rate by License Type</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={utilizationData}
                dataKeys={['utilizationRate']}
                xAxisKey="name"
                height={300}
                colors={utilizationData.map(item => getUtilizationColor(item.utilizationRate))}
                yAxisLabel="Utilization Rate (%)"
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>License Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderWithTooltip 
                    tooltip="Software vendor or publisher name"
                    sortable
                  >
                    Vendor
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    tooltip="Specific software product or application name"
                    sortable
                  >
                    Product
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    className="text-right"
                    tooltip="Total number of licenses purchased"
                    sortable
                  >
                    Quantity
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    className="text-right"
                    tooltip="Number of licenses currently assigned to active users"
                    sortable
                  >
                    Utilized
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    className="text-right"
                    tooltip="Percentage of licenses being actively used (Utilized / Quantity × 100)"
                    sortable
                  >
                    Utilization
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    className="text-right"
                    tooltip="Total monthly subscription or license cost"
                    sortable
                  >
                    Monthly Cost
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    className="text-right"
                    tooltip="Potential monthly savings from removing unused licenses"
                    sortable
                  >
                    Savings
                  </TableHeaderWithTooltip>
                  <TableHeaderWithTooltip 
                    tooltip="License utilization status (optimal, underutilized, or overutilized)"
                    sortable
                  >
                    Status
                  </TableHeaderWithTooltip>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLicenses.map((license, index) => {
                  const dynamicStatus = calculateStatus(license.utilizationRate);
                  
                  return (
                    <TableRow key={license.id} className="cursor-pointer hover:bg-gray-50 transition-all duration-300">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-mono w-6">#{index + 1}</span>
                          {license.vendor}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{license.product}</TableCell>
                      <TableCell className="text-right font-mono">{license.quantity}</TableCell>
                      <TableCell className="text-right font-mono">{license.utilized}</TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          'font-medium font-mono',
                          license.utilizationRate >= 85 ? 'text-green-600' :
                          license.utilizationRate >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        )}>
                          {license.utilizationRate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${Math.round(license.monthlyCost).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600 font-mono">
                        {license.potentialSavings > 0 ? `$${Math.round(license.potentialSavings).toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(dynamicStatus)}>
                          {dynamicStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <FloatingChat agentName="Software License Intelligence" agentType="software-license" />
      </div>
    </div>
  );
}

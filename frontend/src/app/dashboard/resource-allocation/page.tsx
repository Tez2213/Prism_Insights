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
import { Users, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { Heatmap } from '@/components/charts/heatmap';
import { BarChart } from '@/components/charts/bar-chart';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function ResourceAllocationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const projects: any[] = []; // TODO: Add projects API endpoint

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiClient.getTechnicians();
        setTechnicians(data);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  const getUtilizationColor = (rate: number) => {
    if (rate >= 85) return 'text-green-600 bg-green-50';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'over-budget':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const avgUtilization = technicians.length > 0 ? technicians.reduce((sum, t) => sum + t.utilization, 0) / technicians.length : 0;
  const totalBillableHours = technicians.reduce((sum, t) => sum + t.billableHours, 0);
  const activeProjects = projects.length;
  const scopeCreepProjects = projects.filter((p) => p.status === 'over-budget' || p.status === 'at-risk').length;

  // Prepare heatmap data for technician utilization
  const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
  const heatmapData = technicians.map((tech) => ({
    name: tech.name,
    values: tech.weeklyUtilization || Array(8).fill(tech.utilization),
  }));

  // Prepare bar chart data for project profitability
  const projectChartData = projects.map((project) => ({
    name: project.name,
    margin: project.marginPercentage,
  }));

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Resource Allocation & Margin Optimizer' },
  ];

  if (isLoading) {
    return (
      <div>
        <DashboardHeader
          title="Resource Allocation & Margin Optimizer"
          description="Optimize technician utilization and project profitability"
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
        title="Resource Allocation & Margin Optimizer"
        description="Optimize technician utilization and project profitability"
        alerts={[]}
      />

      <div className="p-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            label="Avg Utilization"
            value={avgUtilization.toFixed(0)}
            format="percentage"
            change={3.2}
            trend="up"
            icon={Users}
            tooltip="Average utilization rate across all technicians, indicating resource efficiency"
            calculation="Average of (Billable Hours / Total Hours) × 100 for all technicians"
          />
          <MetricCard
            label="Billable Hours"
            value={totalBillableHours}
            format="number"
            change={5.8}
            trend="up"
            icon={Clock}
            tooltip="Total hours worked by technicians that can be billed to clients"
            calculation="Sum of all billable hours across all technicians"
          />
          <MetricCard
            label="Active Projects"
            value={activeProjects}
            format="number"
            icon={DollarSign}
            tooltip="Number of projects currently in progress with assigned resources"
            calculation="Count of projects with status = 'active'"
          />
          <MetricCard
            label="Projects At Risk"
            value={scopeCreepProjects}
            format="number"
            icon={AlertTriangle}
            tooltip="Projects experiencing budget overruns or scope creep issues"
            calculation="Count of projects with budget utilization > 90%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Technician Utilization Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <Heatmap
                data={heatmapData}
                xLabels={weekLabels}
                height={300}
                dataKey="utilizationRate"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Margin Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={projectChartData}
                dataKeys={['margin']}
                xAxisKey="name"
                height={300}
                colors={projectChartData.map((p) => 
                  p.margin >= 0 ? '#22c55e' : '#ef4444'
                )}
                yAxisLabel="Margin %"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Technician Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderWithTooltip 
                        tooltip="Technician name"
                        sortable
                      >
                        Technician
                      </TableHeaderWithTooltip>
                      <TableHeaderWithTooltip 
                        tooltip="Technical skill level (Junior, Mid-Level, Senior, or Lead)"
                        sortable
                      >
                        Skill Level
                      </TableHeaderWithTooltip>
                      <TableHeaderWithTooltip 
                        className="text-right"
                        tooltip="Percentage of work hours that are billable to clients"
                        sortable
                      >
                        Utilization
                      </TableHeaderWithTooltip>
                      <TableHeaderWithTooltip 
                        className="text-right"
                        tooltip="Total hours worked that can be billed to clients"
                        sortable
                      >
                        Billable Hrs
                      </TableHeaderWithTooltip>
                      <TableHeaderWithTooltip 
                        className="text-right"
                        tooltip="Number of active projects currently assigned"
                        sortable
                      >
                        Projects
                      </TableHeaderWithTooltip>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {technicians.map((tech) => (
                      <TableRow key={tech.id} className="cursor-pointer hover:bg-gray-50">
                        <TableCell className="font-medium">{tech.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tech.skillLevel}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            'inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold',
                            getUtilizationColor(tech.utilizationRate)
                          )}>
                            {tech.utilizationRate}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{tech.billableHours}h</TableCell>
                        <TableCell className="text-right">{tech.activeProjects}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Profitability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderWithTooltip 
                        tooltip="Project name and associated client"
                        sortable
                      >
                        Project
                      </TableHeaderWithTooltip>
                      <TableHeaderWithTooltip 
                        className="text-right"
                        tooltip="Total project budget allocated"
                        sortable
                      >
                        Budget
                      </TableHeaderWithTooltip>
                      <TableHeaderWithTooltip 
                        className="text-right"
                        tooltip="Actual costs incurred to date"
                        sortable
                      >
                        Actual
                      </TableHeaderWithTooltip>
                      <TableHeaderWithTooltip 
                        className="text-right"
                        tooltip="Profit margin percentage (Budget - Actual) / Budget × 100"
                        sortable
                      >
                        Margin
                      </TableHeaderWithTooltip>
                      <TableHeaderWithTooltip 
                        tooltip="Project health status (on-track, at-risk, or over-budget)"
                        sortable
                      >
                        Status
                      </TableHeaderWithTooltip>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          No projects data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      projects.map((project) => (
                        <TableRow key={project.id} className="cursor-pointer hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium">{project.name}</p>
                              <p className="text-xs text-gray-500">{project.clientName}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            ${project.budget.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ${project.actualCost.toLocaleString()}
                          </TableCell>
                          <TableCell className={cn(
                            'text-right font-medium',
                            project.margin >= 0 ? 'text-green-600' : 'text-red-600'
                          )}>
                            {project.marginPercentage.toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <Badge className={getProjectStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <FloatingChat agentName="Resource Allocation & Margin Optimizer" />
      </div>
    </div>
  );
}

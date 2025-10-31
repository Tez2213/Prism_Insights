'use client';

import { useState, useEffect } from 'react';
import { TopNavbar } from '@/components/dashboard/top-navbar';
import { MetricCard } from '@/components/dashboard/metric-card';
import { AgentSummaryCard } from '@/components/dashboard/agent-summary-card';
import { SkeletonCard, SkeletonDashboard } from '@/components/ui/skeleton';
import {
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  TrendingUp as TrendingUpIcon,
  Key,
  Target,
  Users as UsersIcon,
  PieChart,
  FileText,
} from 'lucide-react';
import { agents } from '@/lib/agents';
import { apiClient } from '@/lib/api/client';
import type { Metric } from '@/types';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsData, licensesData, leadsData, techniciansData, departmentsData, vendorsData] = await Promise.all([
          apiClient.getClients(),
          apiClient.getLicenses(),
          apiClient.getLeads(),
          apiClient.getTechnicians(),
          apiClient.getDepartments(),
          apiClient.getVendors(),
        ]);
        
        // Sanitize and normalize data
        setClients((clientsData || []).map((c: any) => ({
          ...c,
          monthlyRevenue: c.monthlyRevenue || c.monthlyRecurring || 0,
          monthlyCosts: c.monthlyCosts || (c.annualCosts ? c.annualCosts / 12 : 0),
          marginPercentage: c.marginPercentage || 0,
        })));
        
        setLicenses((licensesData || []).map((l: any) => ({
          ...l,
          quantity: l.quantity || l.totalLicenses || 0,
          utilizationRate: l.utilizationRate || 0,
          potentialSavings: l.potentialSavings || 0,
        })));
        
        setLeads((leadsData || []).map((l: any) => ({
          ...l,
          estimatedValue: l.estimatedValue || l.value || 0,
          conversionProbability: l.conversionProbability || l.probability || 0,
        })));
        
        setTechnicians((techniciansData || []).map((t: any) => ({
          ...t,
          utilization: t.utilization || 0,
          billableHours: t.billableHours || 0,
        })));
        
        setDepartments((departmentsData || []).map((d: any) => ({
          ...d,
          actualSpend: d.actualSpend || d.spent || 0,
          monthlyBudget: d.monthlyBudget || d.budget || 0,
        })));
        
        setVendors((vendorsData || []).map((v: any) => ({
          ...v,
          annualValue: v.annualValue || v.contractValue || v.totalSpend || 0,
          performanceScore: v.performanceScore || 0,
          status: v.status || 'active',
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error
        setClients([]);
        setLicenses([]);
        setLeads([]);
        setTechnicians([]);
        setDepartments([]);
        setVendors([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate real metrics from data with safety checks
  const totalClients = clients.length;
  const atRiskClients = clients.filter(c => c.status === 'at-risk').length;
  const totalMRR = clients.reduce((sum, c) => sum + (c.monthlyRevenue || 0), 0);
  const totalCosts = clients.reduce((sum, c) => sum + (c.monthlyCosts || 0), 0);
  const overallMargin = totalMRR > 0 ? ((totalMRR - totalCosts) / totalMRR) * 100 : 0;
  
  const totalLicenses = licenses.reduce((sum, l) => sum + (l.quantity || 0), 0);
  const avgUtilization = licenses.length > 0 
    ? licenses.reduce((sum, l) => sum + (l.utilizationRate || 0), 0) / licenses.length 
    : 0;
  const potentialSavings = licenses.reduce((sum, l) => sum + (l.potentialSavings || 0), 0);
  
  const activeLeads = leads.length;
  const pipelineValue = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  const avgConversionRate = leads.length > 0 
    ? leads.reduce((sum, l) => sum + (l.conversionProbability || 0), 0) / leads.length 
    : 0;
  
  const avgTechUtilization = technicians.length > 0 
    ? technicians.reduce((sum, t) => sum + (t.utilization || 0), 0) / technicians.length 
    : 0;
  const totalBillableHours = technicians.reduce((sum, t) => sum + (t.billableHours || 0), 0);
  
  const totalMonthlySpend = departments.reduce((sum, d) => sum + (d.actualSpend || d.spent || 0), 0);
  const totalBudget = departments.reduce((sum, d) => sum + (d.monthlyBudget || d.budget || 0), 0);
  const budgetVariance = totalBudget > 0 ? ((totalMonthlySpend - totalBudget) / totalBudget) * 100 : 0;
  
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const expiringContracts = vendors.filter(v => v.status === 'expiring-soon' || v.status === 'expiring').length;
  const totalAnnualSpend = vendors.reduce((sum, v) => sum + (v.annualValue || v.contractValue || v.totalSpend || 0), 0);

  const agentMetrics: Record<string, Metric[]> = {
    'client-profitability': [
      { label: 'Avg Client Margin', value: Math.round(overallMargin), format: 'percentage' },
      { label: 'At-Risk Clients', value: atRiskClients, format: 'number' },
      { label: 'Total MRR', value: totalMRR, format: 'currency' },
    ],
    'software-license': [
      { label: 'Total Licenses', value: totalLicenses, format: 'number' },
      { label: 'Utilization Rate', value: Math.round(avgUtilization), format: 'percentage' },
      { label: 'Potential Savings', value: potentialSavings, format: 'currency' },
    ],
    'sales-pipeline': [
      { label: 'Active Leads', value: activeLeads, format: 'number' },
      { label: 'Pipeline Value', value: pipelineValue, format: 'currency' },
      { label: 'Conversion Rate', value: Math.round(avgConversionRate), format: 'percentage' },
    ],
    'resource-allocation': [
      { label: 'Avg Utilization', value: Math.round(avgTechUtilization), format: 'percentage' },
      { label: 'Active Technicians', value: technicians.length, format: 'number' },
      { label: 'Billable Hours', value: totalBillableHours, format: 'number' },
    ],
    'departmental-spend': [
      { label: 'Monthly Spend', value: totalMonthlySpend, format: 'currency' },
      { label: 'Budget Variance', value: Math.round(budgetVariance * 10) / 10, format: 'percentage' },
      { label: 'Departments', value: departments.length, format: 'number' },
    ],
    'vendor-management': [
      { label: 'Active Vendors', value: activeVendors, format: 'number' },
      { label: 'Contracts Expiring', value: expiringContracts, format: 'number' },
      { label: 'Annual Spend', value: totalAnnualSpend, format: 'currency' },
    ],
  };

  // Chart data for each agent (sparklines showing trends) with safety checks
  const agentChartData: Record<string, number[]> = {
    'client-profitability': clients.map(c => c.marginPercentage || 0).filter(v => !isNaN(v)),
    'software-license': licenses.map(l => l.utilizationRate || 0).filter(v => !isNaN(v)),
    'sales-pipeline': leads.map(l => l.conversionProbability || 0).filter(v => !isNaN(v)),
    'resource-allocation': technicians.map(t => t.utilization || 0).filter(v => !isNaN(v)),
    'departmental-spend': departments.map(d => (d.actualSpend || d.spent || 0) / 1000).filter(v => !isNaN(v)), // Scale down for better visualization
    'vendor-management': vendors.slice(0, 8).map(v => v.performanceScore || 0).filter(v => !isNaN(v)),
  };

  const agentChartColors: Record<string, string> = {
    'client-profitability': '#10b981', // green
    'software-license': '#3b82f6', // blue
    'sales-pipeline': '#8b5cf6', // purple
    'resource-allocation': '#f59e0b', // amber
    'departmental-spend': '#ef4444', // red
    'vendor-management': '#06b6d4', // cyan
  };

  const agentIcons = {
    'client-profitability': TrendingUpIcon,
    'software-license': Key,
    'sales-pipeline': Target,
    'resource-allocation': UsersIcon,
    'departmental-spend': PieChart,
    'vendor-management': FileText,
  };

  const agentHrefs = {
    'client-profitability': '/dashboard/client-profitability',
    'software-license': '/dashboard/software-license',
    'sales-pipeline': '/dashboard/sales-pipeline',
    'resource-allocation': '/dashboard/resource-allocation',
    'departmental-spend': '/dashboard/departmental-spend',
    'vendor-management': '/dashboard/vendor-management',
  };

  if (isLoading) {
    return (
      <div>
        <TopNavbar
          title="Master Dashboard"
          description="Unified view of all AI agent insights and recommendations"
        />
        <div className="p-8">
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopNavbar
        title="Master Dashboard"
        description="Unified view of all AI agent insights and recommendations"
      />

      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          label="Total Revenue"
          value={totalMRR}
          format="currency"
          change={12.5}
          trend="up"
          icon={DollarSign}
        />
        <MetricCard
          label="Overall Margin"
          value={Math.round(overallMargin)}
          format="percentage"
          change={2.3}
          trend="up"
          icon={TrendingUp}
        />
        <MetricCard
          label="Active Clients"
          value={totalClients}
          format="number"
          change={5}
          trend="up"
          icon={Users}
        />
        <MetricCard
          label="Critical Alerts"
          value={0}
          format="number"
          icon={AlertCircle}
        />
      </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentSummaryCard
                key={agent.id}
                agent={agent}
                metrics={agentMetrics[agent.id] || []}
                href={agentHrefs[agent.id as keyof typeof agentHrefs]}
                icon={agentIcons[agent.id as keyof typeof agentIcons]}
                chartData={agentChartData[agent.id]}
                chartColor={agentChartColors[agent.id]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

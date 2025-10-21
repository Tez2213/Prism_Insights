// Core types for the MSP AI Agent Platform

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'processing' | 'idle' | 'error';
  icon: string;
  color: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'currency' | 'percentage' | 'number';
}

export interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  actionItems?: string[];
}

export interface Client {
  id: string;
  companyName: string;
  industry: string;
  monthlyRevenue: number;
  monthlyCosts: number;
  margin: number;
  marginPercentage: number;
  status: 'active' | 'at-risk' | 'churned';
  contractEndDate: string;
  churnRisk: 'low' | 'medium' | 'high';
}

export interface License {
  id: string;
  vendor: string;
  product: string;
  quantity: number;
  utilized: number;
  utilizationRate: number;
  monthlyCost: number;
  potentialSavings: number;
  status: 'optimal' | 'underutilized' | 'overutilized';
  renewalDate: string;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  industry: string;
  estimatedValue: number;
  aiScore: number;
  conversionProbability: number;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  source: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

export interface AgentResponse {
  agentId: string;
  response: string;
  insights?: string[];
  recommendations?: string[];
  timestamp: string;
}

export interface Department {
  id: string;
  name: string;
  monthlyBudget: number;
  actualSpend: number;
  variance: number;
  variancePercentage: number;
  trend: 'up' | 'down' | 'stable';
  manager: string;
  employeeCount: number;
  categories: {
    name: string;
    spend: number;
  }[];
  historicalSpend: {
    month: string;
    amount: number;
  }[];
}

export interface Contract {
  id: string;
  vendorId: string;
  vendorName: string;
  serviceType: string;
  startDate: string;
  endDate: string;
  value: number;
  renewalStatus: 'auto-renew' | 'manual' | 'expiring';
  slaCompliance: number;
  paymentTerms: string;
  terms: string[];
  slaMetrics: {
    metric: string;
    target: number;
    actual: number;
    unit: string;
  }[];
}

export interface Vendor {
  id: string;
  name: string;
  contractType: string;
  annualValue: number;
  renewalDate: string;
  performanceScore: number;
  status: 'active' | 'expiring-soon' | 'expired';
  contactPerson: string;
  email: string;
  phone: string;
  serviceHistory: {
    date: string;
    service: string;
    satisfaction: number;
  }[];
  performanceMetrics: {
    month: string;
    score: number;
  }[];
}

export interface SpendingCategory {
  id: string;
  name: string;
  allocatedBudget: number;
  actualSpend: number;
  variance: number;
  topDepartments: {
    name: string;
    amount: number;
  }[];
  subcategories: string[];
  topExpenses: {
    description: string;
    amount: number;
    vendor: string;
  }[];
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  utilization: number;
  billableHours: number;
  totalHours: number;
  revenue: number;
  cost: number;
  margin: number;
  status: 'available' | 'busy' | 'on-leave';
  skills: string[];
  currentProjects: {
    clientName: string;
    hoursAllocated: number;
  }[];
}

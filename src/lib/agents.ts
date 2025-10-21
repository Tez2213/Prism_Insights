import type { Agent } from '@/types';

export const agents: Agent[] = [
  {
    id: 'client-profitability',
    name: 'Client Profitability Intelligence',
    description: 'Analyzes client profitability and identifies optimization opportunities',
    status: 'active',
    icon: 'TrendingUp',
    color: 'bg-green-600',
  },
  {
    id: 'software-license',
    name: 'Software License Intelligence',
    description: 'Monitors license usage and identifies cost savings',
    status: 'active',
    icon: 'Key',
    color: 'bg-blue-600',
  },
  {
    id: 'sales-pipeline',
    name: 'Sales Pipeline Optimization',
    description: 'Optimizes sales processes and identifies opportunities',
    status: 'active',
    icon: 'Target',
    color: 'bg-purple-600',
  },
  {
    id: 'resource-allocation',
    name: 'Resource Allocation & Margin Optimizer',
    description: 'Optimizes resource allocation and project margins',
    status: 'idle',
    icon: 'Users',
    color: 'bg-orange-600',
  },
  {
    id: 'departmental-spend',
    name: 'Departmental Spend Analytics',
    description: 'Tracks and analyzes departmental spending',
    status: 'idle',
    icon: 'PieChart',
    color: 'bg-indigo-600',
  },
  {
    id: 'vendor-management',
    name: 'Vendor & Contract Management',
    description: 'Manages vendor relationships and contracts',
    status: 'idle',
    icon: 'FileText',
    color: 'bg-pink-600',
  },
];

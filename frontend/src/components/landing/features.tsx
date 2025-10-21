'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  Key,
  Target,
  Users,
  PieChart,
  FileText,
} from 'lucide-react';

const agents = [
  {
    id: 'client-profitability',
    name: 'Client Profitability Intelligence',
    description:
      'Real-time profitability analysis, margin erosion detection, churn risk prediction, and contract optimization recommendations.',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 'software-license',
    name: 'Software License Intelligence',
    description:
      'Monitor license usage, identify cost-saving opportunities, ensure compliance, and support vendor negotiations with data-driven insights.',
    icon: Key,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 'sales-pipeline',
    name: 'Sales Pipeline Optimization',
    description:
      'AI-powered lead scoring, automated proposal generation, upsell opportunity identification, and revenue forecasting.',
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 'resource-allocation',
    name: 'Resource Allocation & Margin Optimizer',
    description:
      'Optimize technician time allocation, detect scope creep, automate billing reconciliation, and monitor contract performance.',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    id: 'departmental-spend',
    name: 'Departmental Spend Analytics',
    description:
      'Track spending by department, analyze budget variance, detect anomalies, and provide ROI analysis with strategic insights.',
    icon: PieChart,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'vendor-management',
    name: 'Vendor & Contract Management',
    description:
      'Comprehensive contract lifecycle management, vendor performance scoring, market intelligence, and renewal optimization support.',
    icon: FileText,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
];

export function Features() {
  return (
    <section id="agents" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Six Specialized AI Agents
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Collaborative intelligence that works together to optimize every aspect
            of your MSP business operations.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${agent.bgColor}`}>
                    <Icon className={`h-6 w-6 ${agent.color}`} />
                  </div>
                  <CardTitle className="mt-4">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {agent.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 mx-auto max-w-3xl">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-center">Key Differentiator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-700">
                Unlike traditional siloed tools, our agents share intelligence and
                collaborate in real-time. When one agent detects an issue, it
                automatically triggers related agents to provide comprehensive,
                multi-dimensional insights and recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

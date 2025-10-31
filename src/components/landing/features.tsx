'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Key, Target, Users, PieChart, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const agents = [
  {
    id: 'client-profitability',
    name: 'Client Profitability Intelligence',
    description: 'Real-time profitability analysis, margin erosion detection, churn risk prediction, and contract optimization.',
    icon: TrendingUp,
    gradient: 'from-green-400 to-emerald-500',
    iconBg: 'from-green-100 to-emerald-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'software-license',
    name: 'Software License Intelligence',
    description: 'Monitor license usage, identify cost-saving opportunities, ensure compliance, and support vendor negotiations.',
    icon: Key,
    gradient: 'from-blue-400 to-cyan-500',
    iconBg: 'from-blue-100 to-cyan-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'sales-pipeline',
    name: 'Sales Pipeline Optimization',
    description: 'AI-powered lead scoring, automated proposal generation, upsell identification, and revenue forecasting.',
    icon: Target,
    gradient: 'from-purple-400 to-pink-500',
    iconBg: 'from-purple-100 to-pink-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'resource-allocation',
    name: 'Resource Allocation Optimizer',
    description: 'Optimize technician time, detect scope creep, automate billing reconciliation, and monitor contract performance.',
    icon: Users,
    gradient: 'from-orange-400 to-red-500',
    iconBg: 'from-orange-100 to-red-100',
    iconColor: 'text-orange-600',
  },
  {
    id: 'departmental-spend',
    name: 'Departmental Spend Analytics',
    description: 'Track spending by department, analyze budget variance, detect anomalies, and provide ROI analysis.',
    icon: PieChart,
    gradient: 'from-indigo-400 to-blue-500',
    iconBg: 'from-indigo-100 to-blue-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'vendor-management',
    name: 'Vendor & Contract Management',
    description: 'Contract lifecycle management, vendor performance scoring, market intelligence, and renewal optimization.',
    icon: FileText,
    gradient: 'from-pink-400 to-rose-500',
    iconBg: 'from-pink-100 to-rose-100',
    iconColor: 'text-pink-600',
  },
];

export function Features() {
  return (
    <section id="agents" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              Six Specialized{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Agents
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Collaborative intelligence that works together to optimize every aspect of your MSP operations.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-gray-300 group relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <CardHeader>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${agent.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-7 w-7 ${agent.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-gray-600">
                      {agent.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20 mx-auto max-w-4xl"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Key Differentiator
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-700 text-lg leading-relaxed">
                Unlike traditional siloed tools, our agents share intelligence and collaborate in real-time. 
                When one agent detects an issue, it automatically triggers related agents to provide 
                comprehensive, multi-dimensional insights and recommendations.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

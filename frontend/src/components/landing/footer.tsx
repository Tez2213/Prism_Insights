'use client';

import { BarChart3 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Prism Insights
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              Revolutionary AI Agent Ecosystem for Managed Service Providers and
              IT departments. Optimize operations, drive growth, and reduce costs
              with collaborative AI intelligence.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">
                  Features
                </a>
              </li>
              <li>
                <a href="#agents" className="text-sm text-gray-600 hover:text-gray-900">
                  AI Agents
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Project</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-600">SuperOps Hackathon 2025</span>
              </li>
              <li>
                <span className="text-sm text-gray-600">Round 2 Prototype</span>
              </li>
              <li>
                <span className="text-sm text-gray-600">AWS Region: us-east-2</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Built for SuperOps Global Hackathon 2025 - MSP Growth & IT Budget Optimization Track
          </p>
        </div>
      </div>
    </footer>
  );
}

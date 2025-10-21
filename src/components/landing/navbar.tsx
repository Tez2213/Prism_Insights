'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Prism Insights
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#agents"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              AI Agents
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Benefits
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

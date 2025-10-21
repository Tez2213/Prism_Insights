'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, DollarSign, Users } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AI-Powered Business Intelligence for{' '}
            <span className="text-blue-600">MSPs</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Transform your MSP operations with six collaborative AI agents that
            analyze profitability, optimize costs, and drive sustainable growth.
            Real-time insights, automated recommendations, and predictive analytics.
          </p>

          <div className="mt-10 flex items-center justify-center gap-6">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
                View Live Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                15-25% Revenue Growth
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Identify upsell opportunities and optimize pricing
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                20-30% Cost Reduction
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Eliminate waste and optimize resource allocation
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Real-Time Intelligence
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Continuous monitoring and proactive recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

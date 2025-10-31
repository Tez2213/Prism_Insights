'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, DollarSign, Users, Sparkles, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-32 pb-20 sm:pt-40 sm:pb-32">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200 shadow-lg mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SuperOps Hackathon 2025 - Round 2 Prototype
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl leading-tight"
          >
            AI-Powered Intelligence for{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Modern MSPs
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-xl leading-8 text-gray-700 max-w-3xl mx-auto"
          >
            Six collaborative AI agents working in harmony to optimize profitability, 
            reduce costs, and drive sustainable growth. Real-time insights powered by AWS Bedrock.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex items-center justify-center gap-4 flex-wrap"
          >
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 h-14 px-8 text-lg group"
              >
                View Live Demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto"
          >
            <div className="relative group">
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">15-25%</h3>
                <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                <p className="text-xs text-gray-500 mt-2">Identify upsell opportunities</p>
              </div>
            </div>

            <div className="relative group">
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">20-30%</h3>
                <p className="text-sm font-medium text-gray-600">Cost Reduction</p>
                <p className="text-xs text-gray-500 mt-2">Eliminate waste & optimize</p>
              </div>
            </div>

            <div className="relative group">
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Real-Time</h3>
                <p className="text-sm font-medium text-gray-600">AI Intelligence</p>
                <p className="text-xs text-gray-500 mt-2">Continuous monitoring 24/7</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { BarChart3, Github, Linkedin, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Prism Insights
                </span>
                <span className="text-xs text-gray-500 font-medium">AI-Powered MSP Intelligence</span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed mb-6">
              Revolutionary AI Agent Ecosystem for Managed Service Providers. 
              Optimize operations, drive growth, and reduce costs with collaborative AI intelligence 
              powered by AWS Bedrock.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 transition-colors"
              >
                <Github className="h-5 w-5 text-gray-700" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-gray-700" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 transition-colors"
              >
                <Twitter className="h-5 w-5 text-gray-700" />
              </a>
              <a 
                href="mailto:contact@prisminsights.ai"
                className="p-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 transition-colors"
              >
                <Mail className="h-5 w-5 text-gray-700" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#agents" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  AI Agents
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#benefits" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Benefits
                </a>
              </li>
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Project</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-gray-600">SuperOps Hackathon 2025</span>
              </li>
              <li>
                <span className="text-sm text-gray-600">Round 2 Prototype</span>
              </li>
              <li>
                <span className="text-sm text-gray-600">AWS Region: us-east-2</span>
              </li>
              <li>
                <span className="text-sm text-gray-600">Powered by AWS Bedrock</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © 2025 Prism Insights. Built for SuperOps Global Hackathon 2025.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

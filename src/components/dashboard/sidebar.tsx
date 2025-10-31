'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Home,
  DollarSign,
  Key,
  Target,
  Users,
  PieChart,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/lib/contexts/sidebar-context';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home, color: 'text-gray-600' },
  {
    name: 'Client Profitability',
    href: '/dashboard/client-profitability',
    icon: DollarSign,
    color: 'text-green-600',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Software Licenses',
    href: '/dashboard/software-license',
    icon: Key,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Sales Pipeline',
    href: '/dashboard/sales-pipeline',
    icon: Target,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Resource Allocation',
    href: '/dashboard/resource-allocation',
    icon: Users,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    name: 'Departmental Spend',
    href: '/dashboard/departmental-spend',
    icon: PieChart,
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    name: 'Vendor Management',
    href: '/dashboard/vendor-management',
    icon: FileText,
    color: 'text-pink-600',
    gradient: 'from-pink-500 to-rose-500'
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Prism Insights
              </span>
              <span className="text-xs text-gray-500 font-medium">Dashboard</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto">
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative',
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full" />
                  )}
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-lg transition-all',
                      isActive
                        ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg`
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {!collapsed && (
                    <span className="text-sm font-medium flex-1">{item.name}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse Button */}
      <div className="absolute bottom-6 right-0 translate-x-1/2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-white shadow-lg border-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}

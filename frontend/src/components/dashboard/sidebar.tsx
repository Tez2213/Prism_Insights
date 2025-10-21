'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  TrendingUp,
  Key,
  Target,
  Users,
  PieChart,
  FileText,
  BarChart3,
} from 'lucide-react';

const navigation = [
  {
    name: 'Master Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Client Profitability',
    href: '/dashboard/client-profitability',
    icon: TrendingUp,
  },
  {
    name: 'Software License',
    href: '/dashboard/software-license',
    icon: Key,
  },
  {
    name: 'Sales Pipeline',
    href: '/dashboard/sales-pipeline',
    icon: Target,
  },
  {
    name: 'Resource Allocation',
    href: '/dashboard/resource-allocation',
    icon: Users,
  },
  {
    name: 'Departmental Spend',
    href: '/dashboard/departmental-spend',
    icon: PieChart,
  },
  {
    name: 'Vendor Management',
    href: '/dashboard/vendor-management',
    icon: FileText,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <BarChart3 className="h-8 w-8 text-blue-600" />
        <span className="text-lg font-bold text-gray-900">Prism Insights</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>


    </div>
  );
}

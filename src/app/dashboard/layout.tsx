'use client';

import { useAlertMonitor } from '@/hooks/useAlertMonitor';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.Node;
}) {
  // Monitor for alerts across all dashboard pages
  useAlertMonitor();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main>{children}</main>
    </div>
  );
}

'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { PageTransition } from '@/components/ui/page-transition';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
}

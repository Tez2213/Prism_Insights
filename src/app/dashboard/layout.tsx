'use client';

import { useAlertMonitor } from '@/hooks/useAlertMonitor';
import { Sidebar } from '@/components/dashboard/sidebar';
import { SidebarProvider, useSidebar } from '@/lib/contexts/sidebar-context';
import { ClientProvider } from '@/lib/contexts/client-context';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  
  return (
    <>
      <Sidebar />
      <main className={cn(
        'transition-all duration-300',
        collapsed ? 'ml-20' : 'ml-72'
      )}>
        {children}
      </main>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Monitor for alerts across all dashboard pages
  useAlertMonitor();

  return (
    <SidebarProvider>
      <ClientProvider>
        <div className="min-h-screen bg-gray-50">
          <DashboardContent>{children}</DashboardContent>
        </div>
      </ClientProvider>
    </SidebarProvider>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

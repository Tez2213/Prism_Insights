'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BarChart3, Bell, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { useAlertStore } from '@/lib/stores/alertStore';
import { useAlertMonitor } from '@/hooks/useAlertMonitor';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  // Monitor for alerts
  useAlertMonitor();

  const alerts = useAlertStore((state) => state.alerts);
  const unreadCount = useAlertStore((state) => state.unreadCount());
  const markAsRead = useAlertStore((state) => state.markAsRead);
  const markAllAsRead = useAlertStore((state) => state.markAllAsRead);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'client-status':
      case 'churn-risk':
        return <Users className="w-4 h-4" />;
      case 'license-usage':
        return <AlertCircle className="w-4 h-4" />;
      case 'lead-progress':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

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
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge
                          variant="destructive"
                          className="h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between p-2 border-b">
                  <span className="font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No notifications yet
                  </div>
                ) : (
                  alerts.slice(0, 10).map((alert) => (
                    <DropdownMenuItem
                      key={alert.id}
                      className={`p-3 cursor-pointer ${!alert.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(alert.id)}
                    >
                      <div className="flex gap-3 w-full">
                        <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{alert.title}</p>
                          <p className="text-xs text-gray-500 truncate">{alert.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {!alert.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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

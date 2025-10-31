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
import { BarChart3, Bell, AlertCircle, TrendingUp, Users, Menu, X } from 'lucide-react';
import { useAlertStore } from '@/lib/stores/alertStore';
import { useAlertMonitor } from '@/hooks/useAlertMonitor';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    <nav className="fixed top-0 w-full border-b bg-white/80 backdrop-blur-xl z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="#agents"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              AI Agents
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              Benefits
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
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
                <div className="flex items-center justify-between p-3 border-b">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs h-7"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                {alerts.length === 0 ? (
                  <div className="p-8 text-center text-sm text-gray-500">
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

            <Link href="/dashboard" className="hidden sm:block">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-6"
              >
                Launch Dashboard
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-white"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              <Link
                href="#features"
                className="block text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#agents"
                className="block text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Agents
              </Link>
              <Link
                href="#benefits"
                className="block text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefits
              </Link>
              <Link href="/dashboard" className="block sm:hidden">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Launch Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

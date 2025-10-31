'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Download, AlertCircle, TrendingUp, Users, Loader2 } from 'lucide-react';
import { useAlertStore } from '@/lib/stores/alertStore';
import { motion, AnimatePresence } from 'framer-motion';
import { reportGenerator, type ReportData } from '@/lib/reports/report-generator';
import { toast } from 'sonner';

interface TopNavbarProps {
  title: string;
  description?: string;
  onDownloadReport?: () => Promise<ReportData> | ReportData;
}

export function TopNavbar({ title, description, onDownloadReport }: TopNavbarProps) {
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleDownloadReport = async () => {
    if (!onDownloadReport) {
      toast.error('Report generation not configured for this page');
      return;
    }

    try {
      setIsGenerating(true);
      toast.info('Generating professional PDF report...', {
        description: 'AI is analyzing your data and creating charts',
      });

      // Get report data from the page
      const reportData = await onDownloadReport();

      // Generate report with AI insights
      const reportBlob = await reportGenerator.generateReport(reportData);

      // Determine file extension
      const isPDF = reportBlob.type === 'application/pdf';
      const extension = isPDF ? 'pdf' : 'html';
      const filename = `${reportData.pageTitle.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.${extension}`;
      
      // Download the report
      reportGenerator.downloadReport(reportBlob, filename);

      toast.success(`${isPDF ? 'PDF' : 'HTML'} report downloaded successfully!`, {
        description: isPDF ? 'Professional PDF with charts and AI insights' : 'Open the HTML file in your browser to view',
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report', {
        description: error instanceof Error ? error.message : 'Please try again or contact support',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Download Report Button */}
            <Button
              variant="outline"
              size="default"
              onClick={handleDownloadReport}
              disabled={isGenerating || !onDownloadReport}
              className="gap-2 hover:bg-gray-50"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isGenerating ? 'Generating...' : 'Download Report'}
              </span>
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
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
              <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-y-auto">
                <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white">
                  <div>
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({unreadCount} unread)
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs h-7 hover:bg-gray-100"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                {alerts.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 font-medium">No notifications yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      You'll see updates here when they arrive
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {alerts.slice(0, 10).map((alert) => (
                      <DropdownMenuItem
                        key={alert.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          !alert.read ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => markAsRead(alert.id)}
                      >
                        <div className="flex gap-3 w-full">
                          <div
                            className={`p-2.5 rounded-lg ${getSeverityColor(
                              alert.severity
                            )} flex-shrink-0`}
                          >
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-gray-900 leading-tight">
                                {alert.title}
                              </p>
                              {!alert.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

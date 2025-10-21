'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';

interface ReportDownloadProps {
  agentName: string;
}

export function ReportDownload({ agentName }: ReportDownloadProps) {
  const handleDownload = () => {
    // TODO: Implement actual report generation
    console.log(`Downloading report for ${agentName}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Download a comprehensive PDF report with insights, recommendations, and
          detailed analytics from this agent.
        </p>
        <Button onClick={handleDownload} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download PDF Report
        </Button>
      </CardContent>
    </Card>
  );
}

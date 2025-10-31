'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Client } from '@/types';

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientDetailModal({ client, isOpen, onClose }: ClientDetailModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && client) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, client]);

  if (!client) return null;

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-orange-100 text-orange-800';
      case 'churned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const marginTrend = client.marginPercentage > 30 ? 'up' : client.marginPercentage < 25 ? 'down' : 'neutral';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] h-[95vh] max-w-none max-h-none overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isLoading ? 'Loading...' : client.companyName}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                  <Badge className={getChurnRiskColor(client.churnRisk)}>
                    {client.churnRisk} churn risk
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                  <Badge className={getChurnRiskColor(client.churnRisk)}>
                    {client.churnRisk} churn risk
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement AI insights
                    console.log('Get AI insights for:', client.companyName);
                  }}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Insights
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Are you sure you want to remove ${client.companyName}?`)) {
                      // TODO: Implement remove client
                      console.log('Remove client:', client.id);
                      onClose();
                    }
                  }}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>

            <div className="space-y-6 mt-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          ${client.monthlyRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Profit Margin</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {client.marginPercentage.toFixed(1)}%
                        </p>
                      </div>
                      <div className={cn(
                        'h-12 w-12 rounded-lg flex items-center justify-center',
                        marginTrend === 'up' ? 'bg-green-100' : marginTrend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                      )}>
                        {marginTrend === 'up' ? (
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        ) : marginTrend === 'down' ? (
                          <TrendingDown className="h-6 w-6 text-red-600" />
                        ) : (
                          <TrendingUp className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Details */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Financial Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Revenue</span>
                      <span className="font-medium">${(client.monthlyRevenue || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Costs</span>
                      <span className="font-medium">${(client.monthlyCosts || 0).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">Net Margin</span>
                      <span className={`font-bold ${(client.monthlyRevenue - client.monthlyCosts) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${((client.monthlyRevenue || 0) - (client.monthlyCosts || 0)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Margin Percentage</span>
                      <span className="font-medium">{(client.marginPercentage || 0).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Company Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Industry</p>
                        <p className="font-medium">{client.industry || 'Unknown'}</p>
                      </div>
                    </div>
                    {client.contractEndDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Contract End Date</p>
                          <p className="font-medium">{formatDate(client.contractEndDate)}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Employee Count</p>
                        <p className="font-medium">{(client as any).employeeCount || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card className={cn(
                'border-2',
                client.churnRisk === 'high' ? 'border-red-200 bg-red-50' :
                  client.churnRisk === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    {client.churnRisk === 'high' || client.churnRisk === 'medium' ? (
                      <AlertTriangle className={cn(
                        'h-6 w-6 flex-shrink-0',
                        client.churnRisk === 'high' ? 'text-red-600' : 'text-yellow-600'
                      )} />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Risk Assessment</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        {client.churnRisk === 'high' && 'This client shows high churn risk. Immediate action recommended to improve relationship and address concerns.'}
                        {client.churnRisk === 'medium' && 'This client shows moderate churn risk. Monitor closely and consider proactive engagement.'}
                        {client.churnRisk === 'low' && 'This client shows low churn risk. Relationship is healthy with good engagement.'}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">Recommended Actions:</p>
                        <ul className="text-sm text-gray-700 space-y-1 ml-4">
                          {client.churnRisk === 'high' && (
                            <>
                              <li>• Schedule immediate review meeting</li>
                              <li>• Analyze service delivery issues</li>
                              <li>• Prepare retention offer</li>
                              <li>• Review contract terms for optimization</li>
                            </>
                          )}
                          {client.churnRisk === 'medium' && (
                            <>
                              <li>• Schedule quarterly business review</li>
                              <li>• Identify upsell opportunities</li>
                              <li>• Monitor satisfaction metrics</li>
                            </>
                          )}
                          {client.churnRisk === 'low' && (
                            <>
                              <li>• Continue current engagement strategy</li>
                              <li>• Explore expansion opportunities</li>
                              <li>• Request testimonial or referral</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

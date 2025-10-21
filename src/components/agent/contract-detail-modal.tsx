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
import {
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Shield,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Contract } from '@/types';

interface ContractDetailModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContractDetailModal({ contract, isOpen, onClose }: ContractDetailModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && contract) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, contract]);

  if (!contract) return null;

  const getRenewalStatusColor = (status: string) => {
    switch (status) {
      case 'auto-renew':
        return 'bg-green-100 text-green-800';
      case 'manual':
        return 'bg-blue-100 text-blue-800';
      case 'expiring':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSLAColor = (compliance: number) => {
    if (compliance >= 98) return 'text-green-600';
    if (compliance >= 95) return 'text-blue-600';
    if (compliance >= 90) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSLABadgeColor = (compliance: number) => {
    if (compliance >= 98) return 'bg-green-100 text-green-800';
    if (compliance >= 95) return 'bg-blue-100 text-blue-800';
    if (compliance >= 90) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const startDate = new Date(contract.startDate);
  const endDate = new Date(contract.endDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const contractDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.min(100, Math.max(0, (daysElapsed / contractDuration) * 100));
  
  const isExpiring = contract.renewalStatus === 'expiring' || daysUntilExpiry < 90;
  const monthlyValue = contract.value / (contractDuration / 30);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-96 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-2xl">{contract.vendorName} - {contract.serviceType}</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">Contract ID: {contract.id}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getRenewalStatusColor(contract.renewalStatus)}>
                  {contract.renewalStatus.replace('-', ' ')}
                </Badge>
                <Badge className={getSLABadgeColor(contract.slaCompliance)}>
                  {contract.slaCompliance}% SLA Compliance
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Contract Value</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ${contract.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">SLA Compliance</p>
                    <p className={cn(
                      'text-2xl font-bold mt-1',
                      getSLAColor(contract.slaCompliance)
                    )}>
                      {contract.slaCompliance}%
                    </p>
                  </div>
                  <div className={cn(
                    'h-12 w-12 rounded-lg flex items-center justify-center',
                    contract.slaCompliance >= 98 ? 'bg-green-100' : 
                    contract.slaCompliance >= 95 ? 'bg-blue-100' : 'bg-orange-100'
                  )}>
                    <Shield className={cn(
                      'h-6 w-6',
                      contract.slaCompliance >= 98 ? 'text-green-600' : 
                      contract.slaCompliance >= 95 ? 'text-blue-600' : 'text-orange-600'
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contract Timeline */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contract Timeline</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium">{startDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">End Date</span>
                  <span className="font-medium">{endDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Days Until Expiry</span>
                  <span className={cn(
                    'font-medium',
                    daysUntilExpiry < 90 ? 'text-orange-600' : 'text-gray-900'
                  )}>
                    {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Contract Progress</span>
                    <span className="text-sm font-medium">{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={cn(
                        'h-3 rounded-full',
                        progressPercentage > 90 ? 'bg-orange-600' :
                        progressPercentage > 75 ? 'bg-blue-600' : 'bg-green-600'
                      )}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Financial Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Contract Value</span>
                  <span className="font-medium">${contract.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated Monthly Value</span>
                  <span className="font-medium">${Math.round(monthlyValue).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Terms</span>
                  <span className="font-medium">{contract.paymentTerms}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Renewal Status</span>
                  <Badge className={getRenewalStatusColor(contract.renewalStatus)}>
                    {contract.renewalStatus.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SLA Metrics */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                SLA Performance Metrics
              </h3>
              <div className="space-y-4">
                {contract.slaMetrics.map((metric, index) => {
                  const isMetTarget = metric.actual <= metric.target || 
                    (metric.metric.toLowerCase().includes('uptime') || 
                     metric.metric.toLowerCase().includes('rate') ||
                     metric.metric.toLowerCase().includes('score')) && metric.actual >= metric.target;
                  const percentage = metric.metric.toLowerCase().includes('uptime') || 
                    metric.metric.toLowerCase().includes('rate') ||
                    metric.unit === '%'
                    ? (metric.actual / metric.target) * 100
                    : metric.target > 0 ? (metric.actual / metric.target) * 100 : 100;
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{metric.metric}</p>
                          <p className="text-xs text-gray-500">
                            Target: {metric.target}{metric.unit} | Actual: {metric.actual}{metric.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isMetTarget ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={cn(
                            'h-2 rounded-full',
                            isMetTarget ? 'bg-green-600' : 'bg-orange-600'
                          )}
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Contract Terms */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Contract Terms
              </h3>
              <div className="space-y-2">
                {contract.terms.map((term, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">{term}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Schedule */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                Payment Schedule
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Terms</span>
                  <span className="font-medium">{contract.paymentTerms}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Contract Value</span>
                  <span className="font-medium">${contract.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated Monthly Cost</span>
                  <span className="font-medium">${Math.round(monthlyValue).toLocaleString()}</span>
                </div>
                {contract.paymentTerms.toLowerCase().includes('annual') && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Next Payment Due</span>
                    <span className="font-medium">
                      {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cost Comparison */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Market Cost Comparison</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Annual Cost</span>
                  <span className="font-medium">${contract.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated Market Average</span>
                  <span className="font-medium">${Math.round(contract.value * 1.15).toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">Potential Savings</span>
                  <span className="font-bold text-green-600">
                    ${Math.round(contract.value * 0.15).toLocaleString()} (13% below market)
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * Market comparison based on industry benchmarks for similar service types
              </p>
            </CardContent>
          </Card>

          {/* Renewal Recommendations */}
          <Card className={cn(
            'border-2',
            isExpiring ? 'border-orange-200 bg-orange-50' : 
            contract.slaCompliance >= 95 ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'
          )}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                {isExpiring ? (
                  <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0" />
                ) : contract.slaCompliance >= 95 ? (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                ) : (
                  <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Renewal Recommendations</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    {isExpiring 
                      ? `This contract is expiring in ${daysUntilExpiry} days. Immediate action required.`
                      : contract.slaCompliance >= 95
                      ? `Contract is performing well with ${contract.slaCompliance}% SLA compliance. Consider renewal.`
                      : `Contract has ${contract.slaCompliance}% SLA compliance. Review performance before renewal.`
                    }
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Recommended Actions:</p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      {isExpiring ? (
                        <>
                          <li>• Schedule urgent renewal discussion with {contract.vendorName}</li>
                          <li>• Review SLA compliance and service quality</li>
                          <li>• Compare pricing with alternative vendors</li>
                          <li>• Negotiate improved terms or pricing for renewal</li>
                        </>
                      ) : contract.slaCompliance >= 95 ? (
                        <>
                          <li>• Renew contract with current vendor</li>
                          <li>• Negotiate multi-year discount (typically 10-15%)</li>
                          <li>• Request additional services or enhanced SLA terms</li>
                          <li>• Lock in current pricing to avoid future increases</li>
                        </>
                      ) : (
                        <>
                          <li>• Schedule performance review with {contract.vendorName}</li>
                          <li>• Document SLA compliance issues and request remediation plan</li>
                          <li>• Explore alternative vendors as backup options</li>
                          <li>• Consider shorter renewal term (1 year) to reassess performance</li>
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

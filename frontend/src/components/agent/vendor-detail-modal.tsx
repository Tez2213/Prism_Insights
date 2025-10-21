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
  Phone,
  Mail,
  User,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Star,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Vendor } from '@/types';

interface VendorDetailModalProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VendorDetailModal({ vendor, isOpen, onClose }: VendorDetailModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && vendor) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, vendor]);

  if (!vendor) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expiring-soon':
        return 'bg-orange-100 text-orange-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const isExpiringSoon = vendor.status === 'expiring-soon';
  const renewalDate = new Date(vendor.renewalDate);
  const daysUntilRenewal = Math.ceil((renewalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
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
                  <DialogTitle className="text-2xl">{vendor.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(vendor.status)}>
                  {vendor.status.replace('-', ' ')}
                </Badge>
                <Badge className={getPerformanceBadgeColor(vendor.performanceScore)}>
                  {vendor.performanceScore}% Performance
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
                    <p className="text-sm text-gray-600">Annual Contract Value</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ${vendor.annualValue.toLocaleString()}
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
                    <p className="text-sm text-gray-600">Performance Score</p>
                    <p className={cn(
                      'text-2xl font-bold mt-1',
                      getPerformanceColor(vendor.performanceScore)
                    )}>
                      {vendor.performanceScore}%
                    </p>
                  </div>
                  <div className={cn(
                    'h-12 w-12 rounded-lg flex items-center justify-center',
                    vendor.performanceScore >= 90 ? 'bg-green-100' : 
                    vendor.performanceScore >= 80 ? 'bg-blue-100' : 'bg-orange-100'
                  )}>
                    <Star className={cn(
                      'h-6 w-6',
                      vendor.performanceScore >= 90 ? 'text-green-600' : 
                      vendor.performanceScore >= 80 ? 'text-blue-600' : 'text-orange-600'
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contract Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contract Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Contract Type</span>
                  <span className="font-medium">{vendor.contractType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Annual Value</span>
                  <span className="font-medium">${vendor.annualValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Renewal Date</span>
                  <span className="font-medium">{renewalDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Days Until Renewal</span>
                  <span className={cn(
                    'font-medium',
                    daysUntilRenewal < 90 ? 'text-orange-600' : 'text-gray-900'
                  )}>
                    {daysUntilRenewal} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Contact Person</p>
                    <p className="font-medium">{vendor.contactPerson}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{vendor.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{vendor.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics Over Time */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics (Last 6 Months)</h3>
              <div className="space-y-3">
                {vendor.performanceMetrics.map((metric, index) => {
                  const isImproving = index > 0 && metric.score > vendor.performanceMetrics[index - 1].score;
                  const isDecreasing = index > 0 && metric.score < vendor.performanceMetrics[index - 1].score;
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">{metric.month}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{metric.score}%</span>
                          {isImproving && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {isDecreasing && <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={cn(
                            'h-2 rounded-full',
                            metric.score >= 90 ? 'bg-green-600' :
                            metric.score >= 80 ? 'bg-blue-600' : 'bg-orange-600'
                          )}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Service History */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Recent Service History
              </h3>
              <div className="space-y-3">
                {vendor.serviceHistory.map((service, index) => (
                  <div key={index} className="flex justify-between items-start border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{service.service}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(service.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={cn(
                        'text-sm font-semibold',
                        service.satisfaction >= 90 ? 'text-green-600' :
                        service.satisfaction >= 80 ? 'text-blue-600' : 'text-orange-600'
                      )}>
                        {service.satisfaction}%
                      </span>
                      <Star className={cn(
                        'h-4 w-4',
                        service.satisfaction >= 90 ? 'text-green-600' :
                        service.satisfaction >= 80 ? 'text-blue-600' : 'text-orange-600'
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contract Terms Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contract Terms Summary</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    {vendor.contractType} with annual value of ${vendor.annualValue.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Current performance score: {vendor.performanceScore}%
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Average satisfaction rating: {Math.round(vendor.serviceHistory.reduce((acc, s) => acc + s.satisfaction, 0) / vendor.serviceHistory.length)}%
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Contract renewal due: {renewalDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Renewal Recommendations */}
          <Card className={cn(
            'border-2',
            isExpiringSoon ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'
          )}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                {isExpiringSoon ? (
                  <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Renewal Recommendations</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    {isExpiringSoon 
                      ? `Contract with ${vendor.name} is expiring in ${daysUntilRenewal} days. Review and take action soon.`
                      : `Contract with ${vendor.name} is in good standing with ${daysUntilRenewal} days until renewal.`
                    }
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Recommended Actions:</p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      {isExpiringSoon ? (
                        <>
                          <li>• Schedule renewal discussion with {vendor.contactPerson}</li>
                          <li>• Review current contract terms and pricing</li>
                          <li>• Compare with alternative vendors for competitive pricing</li>
                          <li>• Negotiate multi-year discount if performance is satisfactory</li>
                        </>
                      ) : vendor.performanceScore >= 90 ? (
                        <>
                          <li>• Maintain strong relationship with this high-performing vendor</li>
                          <li>• Consider expanding services or negotiating volume discounts</li>
                          <li>• Schedule quarterly business reviews to ensure continued alignment</li>
                          <li>• Document best practices for vendor management</li>
                        </>
                      ) : (
                        <>
                          <li>• Monitor performance metrics closely</li>
                          <li>• Schedule performance review with {vendor.contactPerson}</li>
                          <li>• Identify areas for improvement and set clear expectations</li>
                          <li>• Consider alternative vendors if performance doesn't improve</li>
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

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
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Users,
  Mail,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Department } from '@/types';

interface DepartmentDetailModalProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DepartmentDetailModal({ department, isOpen, onClose }: DepartmentDetailModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && department) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, department]);

  if (!department) return null;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-red-600" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-green-600" />;
      case 'stable':
        return <Minus className="h-5 w-5 text-gray-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'bg-red-100 text-red-800';
      case 'down':
        return 'bg-green-100 text-green-800';
      case 'stable':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverBudget = department.variance < 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
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
                  <DialogTitle className="text-2xl">{department.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getTrendColor(department.trend)}>
                  {department.trend} trend
                </Badge>
                {isOverBudget && (
                  <Badge className="bg-red-100 text-red-800">Over Budget</Badge>
                )}
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
                    <p className="text-sm text-gray-600">Monthly Budget</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ${department.monthlyBudget.toLocaleString()}
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
                    <p className="text-sm text-gray-600">Actual Spend</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ${department.actualSpend.toLocaleString()}
                    </p>
                  </div>
                  <div className={cn(
                    'h-12 w-12 rounded-lg flex items-center justify-center',
                    isOverBudget ? 'bg-red-100' : 'bg-green-100'
                  )}>
                    {getTrendIcon(department.trend)}
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
                  <span className="text-sm text-gray-600">Monthly Budget</span>
                  <span className="font-medium">${department.monthlyBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Actual Spend</span>
                  <span className="font-medium">${department.actualSpend.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">Variance</span>
                  <span className={cn(
                    'font-bold',
                    isOverBudget ? 'text-red-600' : 'text-green-600'
                  )}>
                    {isOverBudget ? '-' : '+'}${Math.abs(department.variance).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Variance Percentage</span>
                  <span className={cn(
                    'font-medium',
                    isOverBudget ? 'text-red-600' : 'text-green-600'
                  )}>
                    {department.variancePercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spending Breakdown by Category */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Spending Breakdown by Category</h3>
              <div className="space-y-3">
                {department.categories.map((category, index) => {
                  const percentage = (category.spend / department.actualSpend) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">{category.name}</span>
                        <span className="text-sm font-medium">
                          ${category.spend.toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Historical Spending Trends */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Historical Spending (Last 6 Months)</h3>
              <div className="space-y-2">
                {department.historicalSpend.map((item, index) => {
                  const isAboveBudget = item.amount > department.monthlyBudget;
                  return (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.month}</span>
                      <span className={cn(
                        'text-sm font-medium',
                        isAboveBudget ? 'text-red-600' : 'text-gray-900'
                      )}>
                        ${item.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Department Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Department Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Manager</p>
                    <p className="font-medium">{department.manager}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Employee Count</p>
                    <p className="font-medium">{department.employeeCount} employees</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Cost per Employee</p>
                    <p className="font-medium">
                      ${Math.round(department.actualSpend / department.employeeCount).toLocaleString()}/month
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Recommendations */}
          <Card className={cn(
            'border-2',
            isOverBudget ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
          )}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                {isOverBudget ? (
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Optimization Recommendations</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    {isOverBudget 
                      ? `${department.name} is over budget by $${Math.abs(department.variance).toLocaleString()}. Consider the following actions to reduce spending.`
                      : `${department.name} is under budget by $${department.variance.toLocaleString()}. Continue current spending practices.`
                    }
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Recommended Actions:</p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      {isOverBudget ? (
                        <>
                          <li>• Review and optimize software license usage</li>
                          <li>• Negotiate better rates with vendors</li>
                          <li>• Identify and eliminate redundant subscriptions</li>
                          <li>• Implement spending approval workflows</li>
                        </>
                      ) : (
                        <>
                          <li>• Maintain current spending discipline</li>
                          <li>• Consider strategic investments in growth areas</li>
                          <li>• Document best practices for other departments</li>
                          <li>• Explore opportunities for further optimization</li>
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

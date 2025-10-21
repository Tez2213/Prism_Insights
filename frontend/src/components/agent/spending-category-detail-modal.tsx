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
  TrendingUp,
  TrendingDown,
  Building2,
  Package,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpendingCategory } from '@/types';

interface SpendingCategoryDetailModalProps {
  category: SpendingCategory | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SpendingCategoryDetailModal({ category, isOpen, onClose }: SpendingCategoryDetailModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && category) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, category]);

  if (!category) return null;

  const isOverBudget = category.variance < 0;
  const utilizationRate = (category.actualSpend / category.allocatedBudget) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
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
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-2xl">{category.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={isOverBudget ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {isOverBudget ? 'Over Budget' : 'Under Budget'}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  {utilizationRate.toFixed(1)}% utilized
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
                    <p className="text-sm text-gray-600">Allocated Budget</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ${category.allocatedBudget.toLocaleString()}
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
                      ${category.actualSpend.toLocaleString()}
                    </p>
                  </div>
                  <div className={cn(
                    'h-12 w-12 rounded-lg flex items-center justify-center',
                    isOverBudget ? 'bg-red-100' : 'bg-green-100'
                  )}>
                    {isOverBudget ? (
                      <TrendingUp className="h-6 w-6 text-red-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-green-600" />
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
                  <span className="text-sm text-gray-600">Allocated Budget</span>
                  <span className="font-medium">${category.allocatedBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Actual Spend</span>
                  <span className="font-medium">${category.actualSpend.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">Variance</span>
                  <span className={cn(
                    'font-bold',
                    isOverBudget ? 'text-red-600' : 'text-green-600'
                  )}>
                    {isOverBudget ? '-' : '+'}${Math.abs(category.variance).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Utilization Rate</span>
                  <span className="font-medium">{utilizationRate.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Spending Departments */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-600" />
                Top Spending Departments
              </h3>
              <div className="space-y-3">
                {category.topDepartments.map((dept, index) => {
                  const percentage = (dept.amount / category.actualSpend) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">{dept.name}</span>
                        <span className="text-sm font-medium">
                          ${dept.amount.toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Expenses */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-600" />
                Top Expenses
              </h3>
              <div className="space-y-3">
                {category.topExpenses.map((expense, index) => (
                  <div key={index} className="flex justify-between items-start border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Vendor: {expense.vendor}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-4">
                      ${expense.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subcategories */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Subcategories</h3>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((subcategory, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {subcategory}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Comparison */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Department Comparison</h3>
              <p className="text-sm text-gray-600 mb-4">
                Spending distribution across departments for {category.name}
              </p>
              <div className="space-y-2">
                {category.topDepartments.map((dept, index) => {
                  const percentage = (dept.amount / category.actualSpend) * 100;
                  const avgSpend = category.actualSpend / category.topDepartments.length;
                  const isAboveAverage = dept.amount > avgSpend;
                  return (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{dept.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${dept.amount.toLocaleString()}</span>
                        {isAboveAverage ? (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            Above Avg
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Below Avg
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Optimization Opportunities */}
          <Card className={cn(
            'border-2',
            isOverBudget ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'
          )}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                {isOverBudget ? (
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                ) : (
                  <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Optimization Opportunities</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    {isOverBudget 
                      ? `${category.name} spending is ${Math.abs(category.variance).toLocaleString()} over budget. Consider these cost reduction strategies.`
                      : `${category.name} spending is well-managed. Here are opportunities for further optimization.`
                    }
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Recommended Actions:</p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      {isOverBudget ? (
                        <>
                          <li>• Consolidate vendors to negotiate volume discounts</li>
                          <li>• Review and eliminate duplicate or unused subscriptions</li>
                          <li>• Implement approval workflows for high-value purchases</li>
                          <li>• Explore alternative vendors with better pricing</li>
                        </>
                      ) : (
                        <>
                          <li>• Negotiate multi-year contracts for better rates</li>
                          <li>• Share best practices with departments spending more</li>
                          <li>• Consider strategic investments in this category</li>
                          <li>• Monitor for emerging cost-saving technologies</li>
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

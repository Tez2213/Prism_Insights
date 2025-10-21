'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { FloatingChat } from '@/components/agent/floating-chat';
import { DepartmentDetailModal } from '@/components/agent/department-detail-modal';
import { SpendingCategoryDetailModal } from '@/components/agent/spending-category-detail-modal';
import { MetricCard } from '@/components/dashboard/metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkeletonDashboard } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableHeaderWithTooltip } from '@/components/ui/table-header-with-tooltip';
import { PieChart, DollarSign, TrendingDown, TrendingUp, Building2, Minus } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { BarChart } from '@/components/charts/bar-chart';
import { LineChart } from '@/components/charts/line-chart';
import { Breadcrumb } from '@/components/ui/breadcrumb';

type Department = any;
type SpendingCategory = any;

export default function DepartmentalSpendPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SpendingCategory | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const [spendingCategories, setSpendingCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiClient.getDepartments();
        setDepartments(data);
        setSpendingCategories([]); // No spending categories endpoint yet
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDepartmentClick = (department: Department) => {
    setSelectedDepartment(department);
    setIsDepartmentModalOpen(true);
  };

  const handleCategoryClick = (category: SpendingCategory) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
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

  // Calculate metrics
  const totalMonthlySpend = departments.reduce((sum, dept) => sum + dept.actualSpend, 0);
  const totalBudget = departments.reduce((sum, dept) => sum + dept.monthlyBudget, 0);
  const totalVariance = departments.reduce((sum, dept) => sum + dept.variance, 0);
  const budgetVariancePercentage = (totalVariance / totalBudget) * 100;
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);
  const costPerEmployee = totalMonthlySpend / totalEmployees;
  const savingsIdentified = Math.abs(totalVariance > 0 ? totalVariance : 0);

  // Prepare data for spending by category stacked bar chart
  const spendingByCategoryData = departments.map(dept => {
    const dataPoint: any = { department: dept.name };
    dept.categories.forEach(cat => {
      dataPoint[cat.name] = cat.spend;
    });
    return dataPoint;
  });

  // Get all unique category names for the chart
  const allCategories = Array.from(
    new Set(departments.flatMap(dept => dept.categories.map(cat => cat.name)))
  );

  // Prepare data for budget variance trend line chart
  const budgetVarianceTrendData = departments[0].historicalSpend.map((_, index) => {
    const month = departments[0].historicalSpend[index].month;
    const totalBudget = departments.reduce((sum, dept) => sum + dept.monthlyBudget, 0);
    const totalActual = departments.reduce((sum, dept) => sum + dept.historicalSpend[index].amount, 0);
    
    return {
      month,
      Budget: totalBudget,
      'Actual Spend': totalActual,
    };
  });

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Departmental Spend Analytics' },
  ];

  if (isLoading) {
    return (
      <div>
        <DashboardHeader
          title="Departmental Spend Analytics"
          description="Track and optimize departmental spending"
          alerts={[]}
        />
        <div className="p-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Departmental Spend Analytics"
        description="Track and optimize departmental spending"
        alerts={[]}
      />

      <div className="p-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            label="Total Monthly Spend"
            value={totalMonthlySpend}
            format="currency"
            change={-3.5}
            trend="down"
            icon={DollarSign}
            tooltip="Total spending across all departments for the current month"
            calculation="Sum of actual spend for all departments"
          />
          <MetricCard
            label="Budget Variance"
            value={budgetVariancePercentage}
            format="percentage"
            change={budgetVariancePercentage}
            trend={budgetVariancePercentage < 0 ? 'down' : 'up'}
            icon={TrendingDown}
            tooltip="Percentage difference between budgeted and actual spending. Negative values indicate under-budget."
            calculation="((Total Actual Spend - Total Budget) / Total Budget) × 100"
          />
          <MetricCard
            label="Cost per Employee"
            value={Math.round(costPerEmployee)}
            format="currency"
            icon={Building2}
            tooltip="Average monthly spending per employee across all departments"
            calculation="Total Monthly Spend / Total Employee Count"
          />
          <MetricCard
            label="Savings Identified"
            value={savingsIdentified}
            format="currency"
            change={12.5}
            trend="up"
            icon={PieChart}
            tooltip="Potential cost savings identified through spending analysis and optimization opportunities"
            calculation="Sum of identified savings opportunities across all categories"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Spending by Category Stacked Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category per Department</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={spendingByCategoryData}
                dataKeys={allCategories}
                xAxisKey="department"
                height={350}
                stacked={true}
                yAxisLabel="Spend ($)"
                colors={[
                  '#3b82f6', // blue
                  '#10b981', // green
                  '#f59e0b', // amber
                  '#ef4444', // red
                  '#8b5cf6', // purple
                  '#ec4899', // pink
                  '#06b6d4', // cyan
                  '#f97316', // orange
                ]}
              />
            </CardContent>
          </Card>

          {/* Budget Variance Trend Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual Spend Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={budgetVarianceTrendData}
                dataKeys={['Budget', 'Actual Spend']}
                xAxisKey="month"
                height={350}
                yAxisLabel="Amount ($)"
                colors={['#3b82f6', '#10b981']}
              />
            </CardContent>
          </Card>
        </div>

        {/* Departments Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Department Spending Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderWithTooltip 
                      className="w-[180px]"
                      tooltip="Department or business unit name"
                      sortable
                    >
                      Department
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="text-right w-[130px]"
                      tooltip="Allocated monthly budget for this department"
                      sortable
                    >
                      Budget
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="text-right w-[130px]"
                      tooltip="Actual spending for the current month"
                      sortable
                    >
                      Actual Spend
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="text-right w-[120px]"
                      tooltip="Difference between budget and actual spend (positive = under budget)"
                      sortable
                    >
                      Variance
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="text-right w-[100px]"
                      tooltip="Variance as a percentage of budget"
                      sortable
                    >
                      Variance %
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="w-[100px]"
                      tooltip="Spending trend direction (up, down, or stable)"
                      sortable
                    >
                      Trend
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="w-[120px]"
                      tooltip="Department manager or budget owner"
                      sortable
                    >
                      Manager
                    </TableHeaderWithTooltip>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => {
                    const isOverBudget = department.variance < 0;
                    return (
                      <TableRow 
                        key={department.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleDepartmentClick(department)}
                      >
                        <TableCell className="font-medium">{department.name}</TableCell>
                        <TableCell className="text-right">
                          ${department.monthlyBudget.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${department.actualSpend.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                          {isOverBudget ? '-' : '+'}${Math.abs(department.variance).toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                          {department.variancePercentage.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <Badge className={getTrendColor(department.trend)}>
                            <span className="flex items-center gap-1">
                              {getTrendIcon(department.trend)}
                              {department.trend}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{department.manager}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Spending Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Categories Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderWithTooltip 
                      className="w-[200px]"
                      tooltip="Spending category or expense type"
                      sortable
                    >
                      Category
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="text-right w-[130px]"
                      tooltip="Total budget allocated across all departments for this category"
                      sortable
                    >
                      Budget
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="text-right w-[130px]"
                      tooltip="Total actual spending across all departments for this category"
                      sortable
                    >
                      Actual Spend
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="text-right w-[120px]"
                      tooltip="Difference between budget and actual spend (positive = under budget)"
                      sortable
                    >
                      Variance
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="w-[250px]"
                      tooltip="Departments with highest spending in this category"
                      sortable
                    >
                      Top Departments
                    </TableHeaderWithTooltip>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spendingCategories.map((category) => {
                    const isOverBudget = category.variance < 0;
                    return (
                      <TableRow 
                        key={category.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">
                          ${category.allocatedBudget.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${category.actualSpend.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                          {isOverBudget ? '-' : '+'}${Math.abs(category.variance).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {category.topDepartments.slice(0, 3).map(dept => dept.name).join(', ')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <DepartmentDetailModal
          department={selectedDepartment}
          isOpen={isDepartmentModalOpen}
          onClose={() => setIsDepartmentModalOpen(false)}
        />

        <SpendingCategoryDetailModal
          category={selectedCategory}
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
        />

        <FloatingChat agentName="Departmental Spend Analytics" />
      </div>
    </div>
  );
}

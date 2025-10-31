'use client';

import { useState, useEffect } from 'react';
import { TopNavbar } from '@/components/dashboard/top-navbar';
import { FloatingChat } from '@/components/agent/floating-chat';
import { VendorDetailModal } from '@/components/agent/vendor-detail-modal';
import { ContractDetailModal } from '@/components/agent/contract-detail-modal';
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
import { FileText, Users, DollarSign, Calendar, Star } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { BarChart } from '@/components/charts/bar-chart';
import { Breadcrumb } from '@/components/ui/breadcrumb';

type Vendor = any;
type Contract = any;

export default function VendorManagementPage() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vendors, setVendors] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [vendorsData, contractsData] = await Promise.all([
          apiClient.getVendors(),
          apiClient.getContracts(),
        ]);
        // Sanitize vendor data
        const sanitizedVendors = (vendorsData || []).map((vendor: any) => ({
          ...vendor,
          annualValue: vendor.annualValue || 0,
          performanceScore: vendor.performanceScore || 0,
          name: vendor.name || 'Unknown',
          contractType: vendor.contractType || 'N/A',
          renewalDate: vendor.renewalDate || new Date().toISOString(),
          status: vendor.status || 'active'
        }));
        // Sanitize contract data
        const sanitizedContracts = (contractsData || []).map((contract: any) => ({
          ...contract,
          vendor: contract.vendor || 'Unknown',
          type: contract.type || 'N/A',
          value: contract.value || 0,
          startDate: contract.startDate || new Date().toISOString(),
          endDate: contract.endDate || new Date().toISOString(),
          renewalStatus: contract.renewalStatus || 'manual',
          status: contract.status || 'active'
        }));
        setVendors(sanitizedVendors);
        setContracts(sanitizedContracts);
      } catch (error) {
        console.error('Error fetching data:', error);
        setVendors([]);
        setContracts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleVendorClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsVendorModalOpen(true);
  };

  const handleContractClick = (contract: Contract) => {
    setSelectedContract(contract);
    setIsContractModalOpen(true);
  };

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

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  // Calculate metrics with safety checks
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const totalAnnualSpend = vendors.reduce((sum, vendor) => sum + (vendor.annualValue || 0), 0);
  const contractsExpiringSoon = vendors.filter(v => v.status === 'expiring-soon').length;
  const activeContracts = contracts.length;
  const averagePerformanceScore = vendors.length > 0 
    ? Math.round(vendors.reduce((sum, vendor) => sum + (vendor.performanceScore || 0), 0) / vendors.length)
    : 0;

  // Prepare vendor performance chart data
  const vendorPerformanceData = vendors
    .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
    .slice(0, 10) // Top 10 vendors
    .map(vendor => ({
      name: vendor.name || 'Unknown',
      score: vendor.performanceScore || 0,
    }));

  // Get color for performance score
  const getPerformanceBarColor = (score: number) => {
    if (score >= 90) return 'hsl(142, 76%, 36%)'; // Green
    if (score >= 80) return 'hsl(221, 83%, 53%)'; // Blue
    if (score >= 70) return 'hsl(25, 95%, 53%)'; // Orange
    return 'hsl(0, 84%, 60%)'; // Red
  };

  // Add color to each data point
  const vendorPerformanceDataWithColors = vendorPerformanceData.map(item => ({
    ...item,
    fill: getPerformanceBarColor(item.score),
  }));

  // Prepare contract renewal timeline data
  const today = new Date();
  const contractRenewalData = contracts
    .map(contract => {
      const endDate = new Date(contract.endDate);
      const daysUntilRenewal = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return {
        id: contract.id,
        vendor: contract.vendorName,
        daysUntilRenewal,
        endDate: contract.endDate,
        value: contract.value,
      };
    })
    .filter(contract => contract.daysUntilRenewal > 0) // Only future renewals
    .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal)
    .slice(0, 12) // Next 12 contracts to renew
    .map(contract => ({
      name: `${contract.vendor} (${contract.id})`,
      days: contract.daysUntilRenewal,
      fill: contract.daysUntilRenewal <= 90 ? 'hsl(25, 95%, 53%)' : // Orange for expiring soon (within 90 days)
            contract.daysUntilRenewal <= 180 ? 'hsl(48, 96%, 53%)' : // Yellow for upcoming (within 180 days)
            'hsl(142, 76%, 36%)', // Green for future
    }));

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Vendor & Contract Management' },
  ];

  if (isLoading) {
    return (
      <div>
        <TopNavbar
          title="Vendor & Contract Management"
          description="Manage vendor relationships and optimize contracts"
        />
        <div className="p-8">
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopNavbar
        title="Vendor & Contract Management"
        description="Manage vendor relationships and optimize contracts"
      />

      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            label="Active Vendors"
            value={activeVendors}
            format="number"
            icon={Users}
            tooltip="Number of vendors with active contracts and ongoing service relationships"
            calculation="Count of vendors with status = 'active'"
          />
          <MetricCard
            label="Total Annual Spend"
            value={totalAnnualSpend}
            format="currency"
            icon={DollarSign}
            tooltip="Total annual contract value across all active vendors"
            calculation="Sum of annual values for all vendors"
          />
          <MetricCard
            label="Contracts Expiring Soon"
            value={contractsExpiringSoon}
            format="number"
            icon={Calendar}
            tooltip="Number of contracts expiring within the next 90 days requiring renewal decisions"
            calculation="Count of contracts with end date within 90 days"
          />
          <MetricCard
            label="Active Contracts"
            value={activeContracts}
            format="number"
            icon={FileText}
            tooltip="Total number of active contracts across all vendors"
            calculation="Count of all contracts with status = 'active'"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Vendor Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={vendorPerformanceDataWithColors}
                dataKeys={['score']}
                xAxisKey="name"
                height={350}
                yAxisLabel="Performance Score (%)"
              />
            </CardContent>
          </Card>

          {/* Contract Renewal Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Renewal Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={contractRenewalData}
                dataKeys={['days']}
                xAxisKey="name"
                height={350}
                yAxisLabel="Days Until Renewal"
              />
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(25, 95%, 53%)' }}></div>
                  <span className="text-gray-600">≤ 90 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(48, 96%, 53%)' }}></div>
                  <span className="text-gray-600">≤ 180 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}></div>
                  <span className="text-gray-600">&gt; 180 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendors Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vendor Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderWithTooltip 
                      className="w-[180px]"
                      tooltip="Vendor or service provider company name"
                      sortable
                    >
                      Vendor Name
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="w-[150px]"
                      tooltip="Type of contract or service agreement"
                      sortable
                    >
                      Contract Type
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="text-right w-[130px]"
                      tooltip="Total annual contract value across all agreements with this vendor"
                      sortable
                    >
                      Annual Value
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="w-[120px]"
                      tooltip="Next contract renewal or expiration date"
                      sortable
                    >
                      Renewal Date
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="text-center w-[120px]"
                      tooltip="Vendor performance score based on SLA compliance, service quality, and responsiveness"
                      sortable
                    >
                      Performance
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="w-[120px]"
                      tooltip="Contract status (active, expiring soon, or expired)"
                      sortable
                    >
                      Status
                    </TableHeaderWithTooltip>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => {
                    const renewalDate = vendor.renewalDate ? new Date(vendor.renewalDate) : new Date();
                    return (
                      <TableRow 
                        key={vendor.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleVendorClick(vendor)}
                      >
                        <TableCell className="font-medium">{vendor.name || 'Unknown'}</TableCell>
                        <TableCell className="text-gray-600">{vendor.contractType || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          ${(vendor.annualValue || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {renewalDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className={`h-4 w-4 ${getPerformanceColor(vendor.performanceScore)}`} />
                            <span className={`font-medium ${getPerformanceColor(vendor.performanceScore)}`}>
                              {vendor.performanceScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(vendor.status)}>
                            {vendor.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Contracts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderWithTooltip 
                      className="w-[120px]"
                      tooltip="Unique contract identifier"
                      sortable
                    >
                      Contract ID
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="w-[150px]"
                      tooltip="Vendor or service provider name"
                      sortable
                    >
                      Vendor
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="w-[180px]"
                      tooltip="Type of service or product provided under this contract"
                      sortable
                    >
                      Service Type
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="w-[110px]"
                      tooltip="Contract start or effective date"
                      sortable
                    >
                      Start Date
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="w-[110px]"
                      tooltip="Contract end or expiration date"
                      sortable
                    >
                      End Date
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="text-right w-[120px]"
                      tooltip="Total contract value"
                      sortable
                    >
                      Value
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="text-center w-[100px]"
                      tooltip="Service Level Agreement compliance percentage"
                      sortable
                    >
                      SLA
                    </TableHeaderWithTooltip>
                    <TableHeaderWithTooltip 
                      className="w-[120px]"
                      tooltip="Contract renewal status (auto-renew, manual, or expiring)"
                      sortable
                    >
                      Renewal
                    </TableHeaderWithTooltip>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => {
                    const startDate = contract.startDate ? new Date(contract.startDate) : new Date();
                    const endDate = contract.endDate ? new Date(contract.endDate) : new Date();
                    return (
                      <TableRow 
                        key={contract.id || Math.random().toString()} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleContractClick(contract)}
                      >
                        <TableCell className="font-medium">{contract.id || 'N/A'}</TableCell>
                        <TableCell className="text-gray-600">{contract.vendorName || 'Unknown'}</TableCell>
                        <TableCell className="text-gray-600">{contract.serviceType || 'N/A'}</TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {startDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {endDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${(contract.value || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-medium ${
                            (contract.slaCompliance || 0) >= 98 ? 'text-green-600' :
                            (contract.slaCompliance || 0) >= 95 ? 'text-blue-600' : 'text-orange-600'
                          }`}>
                            {contract.slaCompliance || 0}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRenewalStatusColor(contract.renewalStatus || 'manual')}>
                            {(contract.renewalStatus || 'manual').replace('-', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <VendorDetailModal
          vendor={selectedVendor}
          isOpen={isVendorModalOpen}
          onClose={() => setIsVendorModalOpen(false)}
        />

        <ContractDetailModal
          contract={selectedContract}
          isOpen={isContractModalOpen}
          onClose={() => setIsContractModalOpen(false)}
        />

        <FloatingChat agentName="Vendor & Contract Management" />
      </div>
    </div>
  );
}

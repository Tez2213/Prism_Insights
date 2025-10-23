from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class Client(BaseModel):
    id: str
    name: str
    industry: str
    employeeCount: int
    annualRevenue: float
    annualCosts: float
    contractValue: float
    contractType: str
    status: str
    monthlyRecurring: float
    churnRisk: str
    lastUpdated: str

class License(BaseModel):
    id: str
    vendor: str
    product: str
    licenseType: str
    totalLicenses: int
    usedLicenses: int
    availableLicenses: int
    costPerLicense: float
    totalCost: float
    renewalDate: str
    complianceStatus: str
    utilizationRate: float
    lastUpdated: str

class Lead(BaseModel):
    id: str
    companyName: str
    contactName: str
    email: str
    phone: str
    stage: str
    value: float
    probability: int
    expectedCloseDate: str
    source: str
    industry: str
    employeeCount: int
    lastContact: str
    lastUpdated: str

class Technician(BaseModel):
    id: str
    name: str
    role: str
    hourlyRate: float
    utilization: float
    billableHours: int
    totalHours: int
    efficiency: float
    certifications: List[str]
    status: str
    lastUpdated: str

class Department(BaseModel):
    id: str
    name: str
    budget: float
    spent: float
    remaining: float
    employeeCount: int
    avgCostPerEmployee: float
    topExpenseCategory: str
    lastUpdated: str

class Vendor(BaseModel):
    id: str
    name: str
    category: str
    totalSpend: float
    contractValue: float
    contractStart: str
    contractEnd: str
    paymentTerms: str
    status: str
    performanceScore: int
    lastUpdated: str

class Contract(BaseModel):
    id: str
    vendorId: str
    vendorName: str
    type: str
    value: float
    startDate: str
    endDate: str
    autoRenew: bool
    noticePeriod: int
    status: str
    lastUpdated: str

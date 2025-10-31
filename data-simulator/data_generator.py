import random
from datetime import datetime, timedelta
from faker import Faker
from typing import List
from models import Client, License, Lead, Technician, Department, Vendor, Contract

fake = Faker()

class DataGenerator:
    def __init__(self):
        self.industries = ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing", "Education"]
        self.license_vendors = ["Microsoft", "Adobe", "Salesforce", "Slack", "Zoom", "Atlassian"]
        self.license_products = {
            "Microsoft": ["Office 365", "Azure", "Dynamics 365"],
            "Adobe": ["Creative Cloud", "Acrobat Pro", "Experience Cloud"],
            "Salesforce": ["Sales Cloud", "Service Cloud", "Marketing Cloud"],
            "Slack": ["Business+", "Enterprise Grid"],
            "Zoom": ["Business", "Enterprise"],
            "Atlassian": ["Jira", "Confluence", "Bitbucket"]
        }
        self.lead_stages = ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]
        self.lead_sources = ["Website", "Referral", "Cold Call", "LinkedIn", "Trade Show", "Partner"]
        self.tech_roles = ["Senior Engineer", "Engineer", "Junior Engineer", "Architect", "Consultant"]
        self.departments = ["IT", "Sales", "Marketing", "HR", "Finance", "Operations"]
        self.vendor_categories = ["Software", "Hardware", "Cloud Services", "Consulting", "Telecom"]
        
    def generate_clients(self, count: int = 20) -> List[Client]:
        clients = []
        for i in range(count):
            revenue = random.uniform(50000, 500000)
            costs = revenue * random.uniform(0.6, 0.8)
            clients.append(Client(
                id=f"client-{i+1}",
                name=fake.company(),
                industry=random.choice(self.industries),
                employeeCount=random.randint(10, 500),
                annualRevenue=round(revenue, 2),
                annualCosts=round(costs, 2),
                contractValue=round(revenue * random.uniform(0.9, 1.1), 2),
                contractType=random.choice(["Standard", "Premium", "Enterprise"]),
                status=random.choice(["Active", "Active", "Active", "At Risk"]),
                monthlyRecurring=round(revenue / 12, 2),
                churnRisk=random.choice(["Low", "Low", "Medium", "High"]),
                lastUpdated=datetime.now().isoformat()
            ))
        return clients
    
    def generate_licenses(self, count: int = 30) -> List[License]:
        licenses = []
        for i in range(count):
            vendor = random.choice(self.license_vendors)
            product = random.choice(self.license_products[vendor])
            total = random.randint(10, 200)
            used = random.randint(int(total * 0.5), total)
            cost_per = random.uniform(10, 100)
            
            licenses.append(License(
                id=f"license-{i+1}",
                vendor=vendor,
                product=product,
                licenseType=random.choice(["User", "Device", "Concurrent"]),
                totalLicenses=total,
                usedLicenses=used,
                availableLicenses=total - used,
                costPerLicense=round(cost_per, 2),
                totalCost=round(total * cost_per, 2),
                renewalDate=(datetime.now() + timedelta(days=random.randint(30, 365))).isoformat(),
                complianceStatus=random.choice(["Compliant", "Compliant", "At Risk", "Over-allocated"]),
                utilizationRate=round((used / total) * 100, 2),
                lastUpdated=datetime.now().isoformat()
            ))
        return licenses
    
    def generate_leads(self, count: int = 25) -> List[Lead]:
        leads = []
        for i in range(count):
            stage = random.choice(self.lead_stages)
            probability = {
                "Prospecting": random.randint(10, 20),
                "Qualification": random.randint(25, 40),
                "Proposal": random.randint(50, 70),
                "Negotiation": random.randint(75, 90),
                "Closed Won": 100,
                "Closed Lost": 0
            }[stage]
            
            leads.append(Lead(
                id=f"lead-{i+1}",
                companyName=fake.company(),
                contactName=fake.name(),
                email=fake.email(),
                phone=fake.phone_number(),
                stage=stage,
                value=round(random.uniform(10000, 200000), 2),
                probability=probability,
                expectedCloseDate=(datetime.now() + timedelta(days=random.randint(7, 90))).isoformat(),
                source=random.choice(self.lead_sources),
                industry=random.choice(self.industries),
                employeeCount=random.randint(10, 500),
                lastContact=(datetime.now() - timedelta(days=random.randint(0, 14))).isoformat(),
                lastUpdated=datetime.now().isoformat()
            ))
        return leads
    
    def generate_technicians(self, count: int = 15) -> List[Technician]:
        technicians = []
        for i in range(count):
            total_hours = 160
            billable = random.randint(80, 150)
            
            technicians.append(Technician(
                id=f"tech-{i+1}",
                name=fake.name(),
                role=random.choice(self.tech_roles),
                hourlyRate=round(random.uniform(50, 150), 2),
                utilization=round((billable / total_hours) * 100, 2),
                billableHours=billable,
                totalHours=total_hours,
                efficiency=round(random.uniform(75, 98), 2),
                certifications=random.sample(["AWS", "Azure", "CISSP", "CCNA", "CompTIA"], k=random.randint(1, 3)),
                status=random.choice(["Available", "Available", "Busy", "On Leave"]),
                lastUpdated=datetime.now().isoformat()
            ))
        return technicians
    
    def generate_departments(self, count: int = 6) -> List[Department]:
        departments = []
        for i, dept_name in enumerate(self.departments[:count]):
            budget = random.uniform(100000, 1000000)
            spent = budget * random.uniform(0.4, 0.9)
            emp_count = random.randint(5, 50)
            
            departments.append(Department(
                id=f"dept-{i+1}",
                name=dept_name,
                budget=round(budget, 2),
                spent=round(spent, 2),
                remaining=round(budget - spent, 2),
                employeeCount=emp_count,
                avgCostPerEmployee=round(spent / emp_count, 2),
                topExpenseCategory=random.choice(["Salaries", "Software", "Hardware", "Travel", "Training"]),
                lastUpdated=datetime.now().isoformat()
            ))
        return departments
    
    def generate_vendors(self, count: int = 15) -> List[Vendor]:
        vendors = []
        for i in range(count):
            contract_value = random.uniform(50000, 500000)
            
            vendors.append(Vendor(
                id=f"vendor-{i+1}",
                name=fake.company(),
                category=random.choice(self.vendor_categories),
                totalSpend=round(contract_value * random.uniform(0.8, 1.2), 2),
                contractValue=round(contract_value, 2),
                contractStart=(datetime.now() - timedelta(days=random.randint(180, 730))).isoformat(),
                contractEnd=(datetime.now() + timedelta(days=random.randint(90, 365))).isoformat(),
                paymentTerms=random.choice(["Net 30", "Net 60", "Net 90", "Prepaid"]),
                status=random.choice(["Active", "Active", "Expiring Soon", "Under Review"]),
                performanceScore=random.randint(60, 100),
                lastUpdated=datetime.now().isoformat()
            ))
        return vendors
    
    def generate_contracts(self, count: int = 20) -> List[Contract]:
        contracts = []
        for i in range(count):
            start_date = datetime.now() - timedelta(days=random.randint(180, 730))
            
            contracts.append(Contract(
                id=f"contract-{i+1}",
                vendorId=f"vendor-{random.randint(1, 15)}",
                vendorName=fake.company(),
                type=random.choice(["Software License", "Service Agreement", "Hardware Lease", "Consulting"]),
                value=round(random.uniform(10000, 300000), 2),
                startDate=start_date.isoformat(),
                endDate=(start_date + timedelta(days=random.randint(365, 1095))).isoformat(),
                autoRenew=random.choice([True, False]),
                noticePeriod=random.choice([30, 60, 90]),
                status=random.choice(["Active", "Active", "Expiring Soon", "Expired"]),
                lastUpdated=datetime.now().isoformat()
            ))
        return contracts
    
    def update_data_realtime(self, data_type: str, existing_data: List):
        """Simulate realistic real-time changes to existing data"""
        if not existing_data:
            return existing_data
        
        # Update fewer items (5-15% of data for realistic changes)
        update_count = max(1, int(len(existing_data) * random.uniform(0.05, 0.15)))
        items_to_update = random.sample(existing_data, update_count)
        
        for item in items_to_update:
            if data_type == "clients":
                # Small, realistic revenue/cost fluctuations (±2-5%)
                revenue_change = random.uniform(0.98, 1.05)
                item.annualRevenue = round(item.annualRevenue * revenue_change, 2)
                # Costs should stay proportional to revenue (60-80%)
                cost_ratio = random.uniform(0.6, 0.8)
                item.annualCosts = round(item.annualRevenue * cost_ratio, 2)
                item.monthlyRecurring = round(item.annualRevenue / 12, 2)
                
                # Rare status changes (5% chance)
                if random.random() < 0.05:
                    # Maintain mostly active clients
                    item.status = random.choice(["Active", "Active", "Active", "Active", "At Risk"])
                    item.churnRisk = random.choice(["Low", "Low", "Low", "Medium", "High"])
                    
            elif data_type == "licenses":
                # Small license usage changes (±1-5 licenses)
                change = random.randint(-2, 5)
                item.usedLicenses = max(0, min(item.totalLicenses, item.usedLicenses + change))
                item.availableLicenses = item.totalLicenses - item.usedLicenses
                item.utilizationRate = round((item.usedLicenses / item.totalLicenses) * 100, 2)
                
            elif data_type == "leads":
                # Occasional lead progression (10% chance)
                if random.random() < 0.1:
                    stages = ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won"]
                    current_idx = stages.index(item.stage) if item.stage in stages else 0
                    if current_idx < len(stages) - 1:
                        item.stage = stages[current_idx + 1]
                        # Realistic probability increases (5-15%)
                        item.probability = min(100, item.probability + random.randint(5, 15))
                        # Small value adjustments (±5%)
                        item.value = round(item.value * random.uniform(0.95, 1.05), 2)
                        
            elif data_type == "technicians":
                # Small utilization changes (±5-10 hours)
                change = random.randint(-5, 10)
                item.billableHours = max(0, min(item.totalHours, item.billableHours + change))
                item.utilization = round((item.billableHours / item.totalHours) * 100, 2)
                
            elif data_type == "departments":
                # Small spending increases (0.5-2% of budget)
                spend_increase = item.budget * random.uniform(0.005, 0.02)
                item.spent = round(min(item.budget, item.spent + spend_increase), 2)
                item.remaining = round(item.budget - item.spent, 2)
                
            item.lastUpdated = datetime.now().isoformat()
        
        return existing_data

generator = DataGenerator()

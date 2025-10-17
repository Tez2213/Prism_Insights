-- Prism Insights MSP AI Agent Platform Database Schema
-- PostgreSQL 15.5

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for text search optimization
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- CLIENTS DOMAIN
-- ============================================================================

-- Clients table for Client Profitability Agent
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    contract_start_date DATE NOT NULL,
    contract_end_date DATE,
    contract_type VARCHAR(50) NOT NULL, -- 'monthly', 'annual', 'multi-year'
    monthly_recurring_revenue DECIMAL(12, 2) NOT NULL,
    annual_contract_value DECIMAL(12, 2) NOT NULL,
    margin_percentage DECIMAL(5, 2),
    health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
    churn_risk VARCHAR(20), -- 'low', 'medium', 'high'
    primary_contact_name VARCHAR(255),
    primary_contact_email VARCHAR(255),
    primary_contact_phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(100) DEFAULT 'USA',
    postal_code VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_contract_dates CHECK (contract_end_date IS NULL OR contract_end_date > contract_start_date)
);

-- Client financial metrics history
CREATE TABLE client_financial_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    revenue DECIMAL(12, 2) NOT NULL,
    cost DECIMAL(12, 2) NOT NULL,
    margin DECIMAL(12, 2) NOT NULL,
    margin_percentage DECIMAL(5, 2) NOT NULL,
    billable_hours DECIMAL(8, 2),
    non_billable_hours DECIMAL(8, 2),
    ticket_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, metric_date)
);

-- Client services
CREATE TABLE client_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_category VARCHAR(100), -- 'managed-services', 'project', 'consulting'
    monthly_cost DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'terminated'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SOFTWARE LICENSES DOMAIN
-- ============================================================================

-- Software vendors
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    vendor_type VARCHAR(100), -- 'software', 'hardware', 'service'
    website VARCHAR(500),
    primary_contact_name VARCHAR(255),
    primary_contact_email VARCHAR(255),
    primary_contact_phone VARCHAR(50),
    account_manager VARCHAR(255),
    support_email VARCHAR(255),
    support_phone VARCHAR(50),
    payment_terms VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Software licenses
CREATE TABLE licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    software_name VARCHAR(255) NOT NULL,
    license_type VARCHAR(100) NOT NULL, -- 'per-user', 'per-device', 'site', 'enterprise'
    total_licenses INTEGER NOT NULL CHECK (total_licenses > 0),
    assigned_licenses INTEGER NOT NULL DEFAULT 0 CHECK (assigned_licenses >= 0),
    available_licenses INTEGER GENERATED ALWAYS AS (total_licenses - assigned_licenses) STORED,
    utilization_rate DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE WHEN total_licenses > 0 
        THEN (assigned_licenses::DECIMAL / total_licenses::DECIMAL * 100)
        ELSE 0 END
    ) STORED,
    cost_per_license DECIMAL(10, 2) NOT NULL,
    billing_frequency VARCHAR(50) NOT NULL, -- 'monthly', 'annual', 'one-time'
    total_annual_cost DECIMAL(12, 2) NOT NULL,
    purchase_date DATE NOT NULL,
    renewal_date DATE,
    expiration_date DATE,
    auto_renewal BOOLEAN DEFAULT false,
    compliance_status VARCHAR(50) DEFAULT 'compliant', -- 'compliant', 'over-deployed', 'under-utilized'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_license_counts CHECK (assigned_licenses <= total_licenses)
);

-- License assignments to users/devices
CREATE TABLE license_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    assigned_to_type VARCHAR(50) NOT NULL, -- 'user', 'device', 'department'
    assigned_to_id VARCHAR(255) NOT NULL,
    assigned_to_name VARCHAR(255) NOT NULL,
    assignment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_used_date DATE,
    usage_frequency VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'rarely', 'never'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- License usage metrics
CREATE TABLE license_usage_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    active_users INTEGER NOT NULL DEFAULT 0,
    total_sessions INTEGER NOT NULL DEFAULT 0,
    total_usage_hours DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(license_id, metric_date)
);

-- ============================================================================
-- SALES PIPELINE DOMAIN
-- ============================================================================

-- Sales leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    lead_source VARCHAR(100), -- 'website', 'referral', 'cold-call', 'event', 'partner'
    lead_score INTEGER CHECK (lead_score >= 0 AND lead_score <= 100),
    stage VARCHAR(50) NOT NULL, -- 'new', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'
    estimated_value DECIMAL(12, 2),
    probability INTEGER CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    actual_close_date DATE,
    assigned_to VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lead activities and interactions
CREATE TABLE lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL, -- 'call', 'email', 'meeting', 'demo', 'proposal-sent'
    activity_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    outcome VARCHAR(100), -- 'positive', 'neutral', 'negative'
    next_action VARCHAR(255),
    next_action_date DATE,
    performed_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sales proposals
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    proposal_number VARCHAR(50) UNIQUE NOT NULL,
    proposal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until_date DATE NOT NULL,
    total_value DECIMAL(12, 2) NOT NULL,
    monthly_recurring_value DECIMAL(12, 2),
    one_time_value DECIMAL(12, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'sent', 'viewed', 'accepted', 'rejected'
    terms TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Proposal line items
CREATE TABLE proposal_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    item_type VARCHAR(100) NOT NULL, -- 'service', 'product', 'license', 'consulting'
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    billing_frequency VARCHAR(50), -- 'one-time', 'monthly', 'annual'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- RESOURCE ALLOCATION DOMAIN
-- ============================================================================

-- Technicians/employees
CREATE TABLE technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(100) NOT NULL, -- 'engineer', 'senior-engineer', 'architect', 'manager'
    department VARCHAR(100),
    hire_date DATE NOT NULL,
    hourly_cost DECIMAL(10, 2) NOT NULL,
    billable_rate DECIMAL(10, 2) NOT NULL,
    target_utilization DECIMAL(5, 2) DEFAULT 80.00, -- Target percentage
    skills TEXT[], -- Array of skills
    certifications TEXT[], -- Array of certifications
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'on-leave', 'terminated'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    project_name VARCHAR(255) NOT NULL,
    project_type VARCHAR(100), -- 'fixed-price', 'time-and-materials', 'retainer'
    start_date DATE NOT NULL,
    end_date DATE,
    estimated_hours DECIMAL(10, 2),
    actual_hours DECIMAL(10, 2) DEFAULT 0,
    budget DECIMAL(12, 2) NOT NULL,
    actual_cost DECIMAL(12, 2) DEFAULT 0,
    revenue DECIMAL(12, 2) DEFAULT 0,
    margin DECIMAL(12, 2) GENERATED ALWAYS AS (revenue - actual_cost) STORED,
    margin_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE WHEN revenue > 0 
        THEN ((revenue - actual_cost) / revenue * 100)
        ELSE 0 END
    ) STORED,
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'active', 'on-hold', 'completed', 'cancelled'
    project_manager VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project assignments
CREATE TABLE project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    assignment_start_date DATE NOT NULL,
    assignment_end_date DATE,
    allocated_hours_per_week DECIMAL(5, 2) NOT NULL,
    role_on_project VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, technician_id, assignment_start_date)
);

-- Time entries
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    entry_date DATE NOT NULL,
    hours DECIMAL(5, 2) NOT NULL CHECK (hours > 0),
    billable BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    task_type VARCHAR(100), -- 'development', 'support', 'meeting', 'admin', 'training'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DEPARTMENTAL SPEND DOMAIN
-- ============================================================================

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    department_code VARCHAR(50) UNIQUE NOT NULL,
    manager_name VARCHAR(255),
    manager_email VARCHAR(255),
    cost_center VARCHAR(100),
    monthly_budget DECIMAL(12, 2) NOT NULL,
    annual_budget DECIMAL(12, 2) NOT NULL,
    employee_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spending categories
CREATE TABLE spending_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    parent_category_id UUID REFERENCES spending_categories(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Department expenses
CREATE TABLE department_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES spending_categories(id) ON DELETE RESTRICT,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    expense_date DATE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    description TEXT NOT NULL,
    invoice_number VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'overdue'
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Department budget tracking
CREATE TABLE department_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    fiscal_year INTEGER NOT NULL,
    fiscal_month INTEGER NOT NULL CHECK (fiscal_month >= 1 AND fiscal_month <= 12),
    budget_amount DECIMAL(12, 2) NOT NULL,
    actual_spend DECIMAL(12, 2) DEFAULT 0,
    variance DECIMAL(12, 2) GENERATED ALWAYS AS (budget_amount - actual_spend) STORED,
    variance_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE WHEN budget_amount > 0 
        THEN ((budget_amount - actual_spend) / budget_amount * 100)
        ELSE 0 END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, fiscal_year, fiscal_month)
);

-- ============================================================================
-- VENDOR MANAGEMENT DOMAIN (Extended)
-- ============================================================================

-- Contracts
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    contract_type VARCHAR(100) NOT NULL, -- 'software', 'hardware', 'service', 'consulting'
    service_type VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    contract_value DECIMAL(12, 2) NOT NULL,
    billing_frequency VARCHAR(50) NOT NULL, -- 'monthly', 'quarterly', 'annual'
    renewal_status VARCHAR(50) DEFAULT 'active', -- 'active', 'expiring-soon', 'expired', 'renewed', 'terminated'
    auto_renewal BOOLEAN DEFAULT false,
    renewal_notice_days INTEGER DEFAULT 90,
    payment_terms VARCHAR(100),
    sla_compliance_target DECIMAL(5, 2) DEFAULT 99.00,
    sla_compliance_actual DECIMAL(5, 2),
    contract_owner VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_contract_dates CHECK (end_date > start_date)
);

-- Vendor performance metrics
CREATE TABLE vendor_performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
    response_time_hours DECIMAL(8, 2),
    resolution_time_hours DECIMAL(8, 2),
    ticket_count INTEGER DEFAULT 0,
    tickets_resolved INTEGER DEFAULT 0,
    customer_satisfaction DECIMAL(3, 2) CHECK (customer_satisfaction >= 0 AND customer_satisfaction <= 5),
    uptime_percentage DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vendor_id, metric_date)
);

-- Contract SLA metrics
CREATE TABLE contract_sla_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    metric_name VARCHAR(255) NOT NULL,
    target_value DECIMAL(10, 2) NOT NULL,
    actual_value DECIMAL(10, 2),
    unit VARCHAR(50), -- 'percentage', 'hours', 'days', 'count'
    measurement_period VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'quarterly'
    last_measured_date DATE,
    status VARCHAR(50), -- 'met', 'not-met', 'at-risk'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Clients indexes
CREATE INDEX idx_clients_name ON clients USING gin(name gin_trgm_ops);
CREATE INDEX idx_clients_contract_dates ON clients(contract_start_date, contract_end_date);
CREATE INDEX idx_clients_health_score ON clients(health_score);
CREATE INDEX idx_clients_churn_risk ON clients(churn_risk);

-- Client financial metrics indexes
CREATE INDEX idx_client_financial_metrics_client_date ON client_financial_metrics(client_id, metric_date DESC);

-- Licenses indexes
CREATE INDEX idx_licenses_vendor ON licenses(vendor_id);
CREATE INDEX idx_licenses_renewal_date ON licenses(renewal_date);
CREATE INDEX idx_licenses_utilization ON licenses(utilization_rate);
CREATE INDEX idx_licenses_compliance ON licenses(compliance_status);

-- License assignments indexes
CREATE INDEX idx_license_assignments_license ON license_assignments(license_id);
CREATE INDEX idx_license_assignments_assigned_to ON license_assignments(assigned_to_id);

-- Leads indexes
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_company_name ON leads USING gin(company_name gin_trgm_ops);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_expected_close_date ON leads(expected_close_date);

-- Technicians indexes
CREATE INDEX idx_technicians_role ON technicians(role);
CREATE INDEX idx_technicians_status ON technicians(status);
CREATE INDEX idx_technicians_skills ON technicians USING gin(skills);

-- Projects indexes
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);

-- Time entries indexes
CREATE INDEX idx_time_entries_technician_date ON time_entries(technician_id, entry_date DESC);
CREATE INDEX idx_time_entries_project ON time_entries(project_id);
CREATE INDEX idx_time_entries_client ON time_entries(client_id);
CREATE INDEX idx_time_entries_billable ON time_entries(billable);

-- Departments indexes
CREATE INDEX idx_departments_name ON departments(name);
CREATE INDEX idx_departments_code ON departments(department_code);

-- Department expenses indexes
CREATE INDEX idx_department_expenses_dept_date ON department_expenses(department_id, expense_date DESC);
CREATE INDEX idx_department_expenses_category ON department_expenses(category_id);
CREATE INDEX idx_department_expenses_vendor ON department_expenses(vendor_id);

-- Contracts indexes
CREATE INDEX idx_contracts_vendor ON contracts(vendor_id);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);
CREATE INDEX idx_contracts_renewal_status ON contracts(renewal_status);

-- Vendor performance indexes
CREATE INDEX idx_vendor_performance_vendor_date ON vendor_performance_metrics(vendor_id, metric_date DESC);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_services_updated_at BEFORE UPDATE ON client_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON licenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_license_assignments_updated_at BEFORE UPDATE ON license_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON technicians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_assignments_updated_at BEFORE UPDATE ON project_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spending_categories_updated_at BEFORE UPDATE ON spending_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_expenses_updated_at BEFORE UPDATE ON department_expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_budgets_updated_at BEFORE UPDATE ON department_budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_sla_metrics_updated_at BEFORE UPDATE ON contract_sla_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Client profitability summary view
CREATE OR REPLACE VIEW v_client_profitability AS
SELECT 
    c.id,
    c.name,
    c.industry,
    c.monthly_recurring_revenue,
    c.annual_contract_value,
    c.margin_percentage,
    c.health_score,
    c.churn_risk,
    COUNT(DISTINCT cs.id) as service_count,
    SUM(cs.monthly_cost) as total_monthly_service_cost
FROM clients c
LEFT JOIN client_services cs ON c.id = cs.client_id AND cs.status = 'active'
GROUP BY c.id;

-- License utilization summary view
CREATE OR REPLACE VIEW v_license_utilization AS
SELECT 
    l.id,
    l.software_name,
    v.name as vendor_name,
    l.total_licenses,
    l.assigned_licenses,
    l.available_licenses,
    l.utilization_rate,
    l.total_annual_cost,
    l.cost_per_license,
    l.renewal_date,
    l.compliance_status
FROM licenses l
JOIN vendors v ON l.vendor_id = v.id;

-- Technician utilization summary view
CREATE OR REPLACE VIEW v_technician_utilization AS
SELECT 
    t.id,
    t.employee_id,
    t.first_name || ' ' || t.last_name as full_name,
    t.role,
    t.department,
    t.target_utilization,
    COUNT(DISTINCT pa.project_id) as active_projects,
    SUM(pa.allocated_hours_per_week) as total_allocated_hours
FROM technicians t
LEFT JOIN project_assignments pa ON t.id = pa.technician_id 
    AND (pa.assignment_end_date IS NULL OR pa.assignment_end_date >= CURRENT_DATE)
WHERE t.status = 'active'
GROUP BY t.id;

-- Department spending summary view
CREATE OR REPLACE VIEW v_department_spending AS
SELECT 
    d.id,
    d.name,
    d.department_code,
    d.manager_name,
    d.monthly_budget,
    d.annual_budget,
    d.employee_count,
    COALESCE(SUM(de.amount), 0) as total_spend,
    d.monthly_budget - COALESCE(SUM(de.amount), 0) as budget_variance
FROM departments d
LEFT JOIN department_expenses de ON d.id = de.department_id 
    AND de.expense_date >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY d.id;

-- Contract renewal calendar view
CREATE OR REPLACE VIEW v_contract_renewals AS
SELECT 
    c.id,
    c.contract_number,
    v.name as vendor_name,
    c.contract_type,
    c.service_type,
    c.end_date,
    c.contract_value,
    c.renewal_status,
    c.auto_renewal,
    c.end_date - CURRENT_DATE as days_until_expiration,
    CASE 
        WHEN c.end_date - CURRENT_DATE <= 30 THEN 'critical'
        WHEN c.end_date - CURRENT_DATE <= 90 THEN 'warning'
        ELSE 'normal'
    END as urgency_level
FROM contracts c
JOIN vendors v ON c.vendor_id = v.id
WHERE c.renewal_status IN ('active', 'expiring-soon')
ORDER BY c.end_date;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE clients IS 'MSP client information for profitability tracking';
COMMENT ON TABLE licenses IS 'Software license inventory and utilization tracking';
COMMENT ON TABLE leads IS 'Sales pipeline leads and opportunities';
COMMENT ON TABLE technicians IS 'Employee/technician resource information';
COMMENT ON TABLE projects IS 'Client projects for resource allocation and margin tracking';
COMMENT ON TABLE departments IS 'Internal departments for spend tracking';
COMMENT ON TABLE contracts IS 'Vendor contracts for management and renewal tracking';

-- Schema version tracking
CREATE TABLE schema_version (
    version VARCHAR(50) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

INSERT INTO schema_version (version, description) 
VALUES ('1.0.0', 'Initial schema for Prism Insights MSP AI Agent Platform');

/**
 * AI-Powered Report Generator
 * Uses AWS Bedrock to generate intelligent insights and recommendations
 */

export interface ReportData {
  pageTitle: string;
  pageType: 'client-profitability' | 'software-license' | 'sales-pipeline' | 'resource-allocation' | 'departmental-spend' | 'vendor-management';
  data: any;
  metrics: {
    label: string;
    value: string | number;
    trend?: string;
  }[];
  charts: {
    title: string;
    type: string;
    data: any[];
  }[];
}

export interface AIInsights {
  summary: string;
  keyFindings: string[];
  risks: {
    level: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }[];
  opportunities: string[];
  recommendations: string[];
  nextActions: string[];
}

class ReportGenerator {
  /**
   * Generate AI insights using AWS Bedrock
   */
  async generateAIInsights(reportData: ReportData): Promise<AIInsights> {
    try {
      const response = await fetch('/api/bedrock/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageType: reportData.pageType,
          pageTitle: reportData.pageTitle,
          metrics: reportData.metrics,
          dataSnapshot: this.prepareDataSnapshot(reportData),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI insights');
      }

      const insights = await response.json();
      return insights;
    } catch (error) {
      console.error('Error generating AI insights:', error);
      // Return fallback insights
      return this.getFallbackInsights(reportData);
    }
  }

  /**
   * Prepare data snapshot for AI analysis
   */
  private prepareDataSnapshot(reportData: ReportData): any {
    const { pageType, data, metrics } = reportData;

    switch (pageType) {
      case 'client-profitability':
        return {
          totalClients: data.length,
          avgMargin: metrics.find(m => m.label.includes('Margin'))?.value,
          atRiskClients: data.filter((c: any) => c.marginPercentage < 20).length,
          topPerformers: data.slice(0, 3).map((c: any) => c.companyName),
        };
      
      case 'software-license':
        return {
          totalLicenses: data.length,
          underutilized: data.filter((l: any) => l.utilizationRate < 50).length,
          totalCost: data.reduce((sum: number, l: any) => sum + (l.monthlyCost || 0), 0),
          avgUtilization: metrics.find(m => m.label.includes('Utilization'))?.value,
        };
      
      case 'sales-pipeline':
        return {
          totalLeads: data.length,
          conversionRate: metrics.find(m => m.label.includes('Conversion'))?.value,
          pipelineValue: metrics.find(m => m.label.includes('Value'))?.value,
          stageDistribution: data.reduce((acc: any, lead: any) => {
            acc[lead.stage] = (acc[lead.stage] || 0) + 1;
            return acc;
          }, {}),
        };
      
      case 'resource-allocation':
        return {
          totalTechnicians: data.length,
          avgUtilization: metrics.find(m => m.label.includes('Utilization'))?.value,
          overallocated: data.filter((t: any) => t.utilizationRate > 90).length,
          underutilized: data.filter((t: any) => t.utilizationRate < 60).length,
        };
      
      case 'departmental-spend':
        return {
          totalDepartments: data.length,
          totalSpend: metrics.find(m => m.label.includes('Spend'))?.value,
          budgetVariance: metrics.find(m => m.label.includes('Variance'))?.value,
          overBudget: data.filter((d: any) => d.variance > 0).length,
        };
      
      case 'vendor-management':
        return {
          totalVendors: data.length,
          avgPerformance: metrics.find(m => m.label.includes('Performance'))?.value,
          contractsExpiring: data.filter((v: any) => v.contractStatus === 'expiring').length,
          topVendors: data.slice(0, 3).map((v: any) => v.name),
        };
      
      default:
        return { summary: 'General data analysis' };
    }
  }

  /**
   * Fallback insights when AI is unavailable
   */
  private getFallbackInsights(reportData: ReportData): AIInsights {
    const { pageType, metrics } = reportData;

    const insights: AIInsights = {
      summary: `Analysis of ${reportData.pageTitle} data showing key metrics and trends.`,
      keyFindings: [],
      risks: [],
      opportunities: [],
      recommendations: [],
      nextActions: [],
    };

    switch (pageType) {
      case 'client-profitability':
        insights.keyFindings = [
          'Client profitability varies significantly across portfolio',
          'Top 20% of clients generate 80% of profit margin',
          'Several clients showing declining margin trends',
        ];
        insights.risks = [
          {
            level: 'high',
            description: 'Clients with margins below 15% are at risk of becoming unprofitable',
            recommendation: 'Review service delivery costs and consider pricing adjustments',
          },
          {
            level: 'medium',
            description: 'Contract renewal dates approaching for key accounts',
            recommendation: 'Initiate renewal discussions 90 days in advance',
          },
        ];
        insights.opportunities = [
          'Upsell opportunities identified in high-margin accounts',
          'Service optimization could improve margins by 5-10%',
        ];
        insights.recommendations = [
          'Focus on high-margin clients for expansion',
          'Implement cost controls for low-margin accounts',
          'Review pricing strategy for new contracts',
        ];
        insights.nextActions = [
          'Schedule profitability review meetings',
          'Analyze service delivery efficiency',
          'Prepare contract renewal proposals',
        ];
        break;

      case 'software-license':
        insights.keyFindings = [
          'Significant license underutilization detected',
          'Potential cost savings of 20-30% identified',
          'License compliance risks in certain categories',
        ];
        insights.risks = [
          {
            level: 'medium',
            description: 'Over-provisioned licenses wasting budget',
            recommendation: 'Right-size license counts based on actual usage',
          },
          {
            level: 'low',
            description: 'Upcoming renewal dates for major software vendors',
            recommendation: 'Negotiate volume discounts during renewal',
          },
        ];
        insights.opportunities = [
          'Consolidate similar tools to reduce costs',
          'Negotiate better rates with high-spend vendors',
        ];
        insights.recommendations = [
          'Implement license usage monitoring',
          'Reclaim unused licenses quarterly',
          'Consider alternative vendors for underutilized tools',
        ];
        insights.nextActions = [
          'Audit all software licenses',
          'Contact vendors for optimization discussions',
          'Implement automated usage tracking',
        ];
        break;

      case 'sales-pipeline':
        insights.keyFindings = [
          'Pipeline conversion rates vary by stage',
          'Average deal cycle is longer than industry standard',
          'High-value opportunities concentrated in specific sectors',
        ];
        insights.risks = [
          {
            level: 'medium',
            description: 'Leads stalling in qualification stage',
            recommendation: 'Implement lead scoring and prioritization',
          },
          {
            level: 'low',
            description: 'Seasonal fluctuations in pipeline value',
            recommendation: 'Plan resource allocation for peak periods',
          },
        ];
        insights.opportunities = [
          'Accelerate deals in proposal stage',
          'Focus on high-probability opportunities',
        ];
        insights.recommendations = [
          'Streamline qualification process',
          'Implement automated follow-up sequences',
          'Focus on industries with highest conversion',
        ];
        insights.nextActions = [
          'Review stalled opportunities',
          'Update sales playbooks',
          'Train team on objection handling',
        ];
        break;

      case 'resource-allocation':
        insights.keyFindings = [
          'Resource utilization varies significantly by technician',
          'Some team members consistently over-allocated',
          'Skill gaps identified in certain service areas',
        ];
        insights.risks = [
          {
            level: 'high',
            description: 'Burnout risk for over-utilized technicians',
            recommendation: 'Rebalance workload and consider hiring',
          },
          {
            level: 'medium',
            description: 'Underutilized resources reducing profitability',
            recommendation: 'Optimize scheduling and project assignments',
          },
        ];
        insights.opportunities = [
          'Cross-train technicians to improve flexibility',
          'Automate routine tasks to free up capacity',
        ];
        insights.recommendations = [
          'Implement capacity planning tools',
          'Balance workload across team members',
          'Invest in training for high-demand skills',
        ];
        insights.nextActions = [
          'Review individual utilization rates',
          'Adjust project assignments',
          'Plan training initiatives',
        ];
        break;

      case 'departmental-spend':
        insights.keyFindings = [
          'Budget variances detected across departments',
          'Spending patterns show seasonal trends',
          'Opportunities for cost consolidation identified',
        ];
        insights.risks = [
          {
            level: 'medium',
            description: 'Departments exceeding budget allocations',
            recommendation: 'Implement spending controls and approval workflows',
          },
          {
            level: 'low',
            description: 'Unplanned expenses impacting margins',
            recommendation: 'Improve budget forecasting accuracy',
          },
        ];
        insights.opportunities = [
          'Negotiate volume discounts across departments',
          'Consolidate vendors for better pricing',
        ];
        insights.recommendations = [
          'Implement monthly budget reviews',
          'Centralize procurement for better rates',
          'Establish spending approval thresholds',
        ];
        insights.nextActions = [
          'Meet with department heads',
          'Review vendor contracts',
          'Update budget forecasts',
        ];
        break;

      case 'vendor-management':
        insights.keyFindings = [
          'Vendor performance varies significantly',
          'Contract renewal opportunities approaching',
          'Potential for vendor consolidation',
        ];
        insights.risks = [
          {
            level: 'medium',
            description: 'Low-performing vendors impacting service quality',
            recommendation: 'Review SLAs and consider alternative vendors',
          },
          {
            level: 'low',
            description: 'Contract auto-renewals without review',
            recommendation: 'Implement 90-day renewal review process',
          },
        ];
        insights.opportunities = [
          'Renegotiate contracts with top vendors',
          'Consolidate services with fewer vendors',
        ];
        insights.recommendations = [
          'Implement vendor scorecards',
          'Schedule quarterly business reviews',
          'Negotiate multi-year agreements for discounts',
        ];
        insights.nextActions = [
          'Review vendor performance metrics',
          'Prepare contract renewal strategy',
          'Identify consolidation opportunities',
        ];
        break;
    }

    return insights;
  }

  /**
   * Generate downloadable report
   */
  async generateReport(reportData: ReportData): Promise<Blob> {
    // Check if simulator URL is configured
    const simulatorUrl = process.env.NEXT_PUBLIC_SIMULATOR_URL;
    
    if (!simulatorUrl) {
      throw new Error('Report server not configured. Please contact administrator.');
    }

    // Get AI insights first
    const insights = await this.generateAIInsights(reportData);
    
    // Call Python server to generate professional PDF
    const response = await fetch(`${simulatorUrl}/api/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...reportData,
        insights,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Report generation failed: ${errorText}`);
    }

    // Get PDF blob
    const blob = await response.blob();
    
    // Verify it's actually a PDF
    if (blob.type !== 'application/pdf') {
      throw new Error('Server returned invalid PDF file');
    }
    
    return blob;
  }

  /**
   * Generate HTML report with styling
   */
  private generateHTMLReport(reportData: ReportData, insights: AIInsights): string {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportData.pageTitle} - Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #f9fafb;
      padding: 40px 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .report-title {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }
    .report-date {
      color: #6b7280;
      font-size: 14px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }
    .metric-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .metric-value {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
    }
    .ai-summary {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      padding: 24px;
      border-radius: 8px;
      border-left: 4px solid #f59e0b;
      margin-bottom: 30px;
    }
    .ai-summary-title {
      font-size: 16px;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ai-summary-text {
      color: #78350f;
      line-height: 1.8;
    }
    .findings-list {
      list-style: none;
      margin-bottom: 20px;
    }
    .findings-list li {
      padding: 12px 16px;
      background: #f9fafb;
      border-left: 3px solid #3b82f6;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    .risk-card {
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 16px;
      border-left: 4px solid;
    }
    .risk-high {
      background: #fef2f2;
      border-color: #ef4444;
    }
    .risk-medium {
      background: #fffbeb;
      border-color: #f59e0b;
    }
    .risk-low {
      background: #f0fdf4;
      border-color: #10b981;
    }
    .risk-level {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .risk-level-high {
      background: #fee2e2;
      color: #991b1b;
    }
    .risk-level-medium {
      background: #fef3c7;
      color: #92400e;
    }
    .risk-level-low {
      background: #d1fae5;
      color: #065f46;
    }
    .risk-description {
      font-weight: 600;
      margin-bottom: 8px;
      color: #111827;
    }
    .risk-recommendation {
      color: #6b7280;
      font-size: 14px;
    }
    .recommendations-list {
      list-style: none;
    }
    .recommendations-list li {
      padding: 16px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-left: 4px solid #10b981;
      margin-bottom: 12px;
      border-radius: 4px;
    }
    .recommendations-list li:before {
      content: "✓";
      color: #10b981;
      font-weight: bold;
      margin-right: 12px;
      font-size: 18px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .chart-placeholder {
      background: #f3f4f6;
      padding: 40px;
      border-radius: 8px;
      text-align: center;
      color: #6b7280;
      margin-bottom: 20px;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🔮 Prism Insights</div>
      <h1 class="report-title">${reportData.pageTitle}</h1>
      <p class="report-date">Generated on ${date}</p>
    </div>

    <div class="section">
      <h2 class="section-title">📊 Key Metrics</h2>
      <div class="metrics-grid">
        ${reportData.metrics.map(metric => `
          <div class="metric-card">
            <div class="metric-label">${metric.label}</div>
            <div class="metric-value">${metric.value}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">🤖 AI-Powered Analysis</h2>
      <div class="ai-summary">
        <div class="ai-summary-title">
          <span>💡</span>
          <span>Executive Summary</span>
        </div>
        <p class="ai-summary-text">${insights.summary}</p>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">🔍 Key Findings</h2>
      <ul class="findings-list">
        ${insights.keyFindings.map(finding => `
          <li>${finding}</li>
        `).join('')}
      </ul>
    </div>

    <div class="section">
      <h2 class="section-title">⚠️ Risk Assessment</h2>
      ${insights.risks.map(risk => `
        <div class="risk-card risk-${risk.level}">
          <span class="risk-level risk-level-${risk.level}">${risk.level} Risk</span>
          <div class="risk-description">${risk.description}</div>
          <div class="risk-recommendation"><strong>Recommendation:</strong> ${risk.recommendation}</div>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h2 class="section-title">💎 Opportunities</h2>
      <ul class="findings-list">
        ${insights.opportunities.map(opp => `
          <li>${opp}</li>
        `).join('')}
      </ul>
    </div>

    <div class="section">
      <h2 class="section-title">✅ Recommendations</h2>
      <ul class="recommendations-list">
        ${insights.recommendations.map(rec => `
          <li>${rec}</li>
        `).join('')}
      </ul>
    </div>

    <div class="section">
      <h2 class="section-title">🎯 Next Actions</h2>
      <ul class="recommendations-list">
        ${insights.nextActions.map(action => `
          <li>${action}</li>
        `).join('')}
      </ul>
    </div>

    <div class="footer">
      <p><strong>Prism Insights</strong> - AI-Powered Business Intelligence Platform</p>
      <p>This report was generated using AWS Bedrock AI for intelligent analysis and recommendations.</p>
      <p style="margin-top: 10px; font-size: 12px;">© ${new Date().getFullYear()} Prism Insights. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Download report file (PDF or HTML)
   */
  downloadReport(blob: Blob, filename: string) {
    // Determine file extension based on blob type
    const isPDF = blob.type === 'application/pdf';
    const finalFilename = isPDF 
      ? filename.replace('.html', '.pdf')
      : filename;
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const reportGenerator = new ReportGenerator();

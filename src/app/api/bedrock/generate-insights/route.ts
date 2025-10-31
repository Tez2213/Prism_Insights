import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageType, pageTitle, metrics, dataSnapshot } = body;

    // Generate AI insights prompt
    const prompt = generateInsightsPrompt(pageType, pageTitle, metrics, dataSnapshot);

    // Call Bedrock (using the existing agent or direct Claude API)
    const insights = await generateBedrockInsights(prompt, pageType);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

function generateInsightsPrompt(
  pageType: string,
  pageTitle: string,
  metrics: any[],
  dataSnapshot: any
): string {
  return `You are an expert business intelligence analyst for an MSP (Managed Service Provider). 
Analyze the following ${pageTitle} data and provide actionable insights.

METRICS:
${metrics.map(m => `- ${m.label}: ${m.value}`).join('\n')}

DATA SNAPSHOT:
${JSON.stringify(dataSnapshot, null, 2)}

Please provide a comprehensive analysis in the following JSON format:
{
  "summary": "A 2-3 sentence executive summary of the current state",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "risks": [
    {
      "level": "high|medium|low",
      "description": "Description of the risk",
      "recommendation": "Specific action to mitigate"
    }
  ],
  "opportunities": ["Opportunity 1", "Opportunity 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "nextActions": ["Action 1", "Action 2", "Action 3"]
}

Focus on:
1. Financial impact and ROI
2. Operational efficiency
3. Risk mitigation
4. Growth opportunities
5. Specific, actionable recommendations

Be concise, professional, and data-driven.`;
}

async function generateBedrockInsights(prompt: string, pageType: string): Promise<any> {
  // For now, return structured insights
  // In production, this would call AWS Bedrock API
  
  // Simulate AI response with intelligent defaults based on page type
  const insights = {
    summary: `Analysis of ${pageType} data reveals key opportunities for optimization and risk mitigation. Current performance metrics indicate areas requiring immediate attention and strategic planning.`,
    keyFindings: [
      'Performance metrics show significant variation across key indicators',
      'Opportunities identified for cost optimization and efficiency improvements',
      'Risk factors detected that require proactive management',
    ],
    risks: [
      {
        level: 'medium',
        description: 'Current trends indicate potential challenges in maintaining optimal performance levels',
        recommendation: 'Implement monitoring and early warning systems to address issues proactively',
      },
    ],
    opportunities: [
      'Strategic initiatives could improve overall performance by 15-25%',
      'Process optimization opportunities identified across multiple areas',
    ],
    recommendations: [
      'Establish regular review cycles to monitor key performance indicators',
      'Implement data-driven decision-making processes',
      'Invest in automation and optimization tools',
    ],
    nextActions: [
      'Schedule stakeholder review meeting within 7 days',
      'Develop detailed action plan for identified opportunities',
      'Assign ownership for risk mitigation initiatives',
    ],
  };

  return insights;
}

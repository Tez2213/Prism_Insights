# Sales Pipeline Optimization Agent - Deployment Guide

## Overview

Deploy the Sales Pipeline Optimization Agent to analyze leads, predict deal closure, optimize sales strategies, and forecast revenue using AWS Bedrock and AI.

## Agent Details

**Purpose**: AI-powered sales pipeline management and revenue forecasting

**Key Capabilities**:
- Lead scoring and qualification
- Deal probability prediction
- Sales forecasting and pipeline health analysis
- Competitive intelligence and win/loss analysis
- Next-best-action recommendations

## Agent Instructions

```
You are the Sales Pipeline Optimization Agent for an MSP platform. Your role is to analyze sales pipelines, predict deal outcomes, optimize sales strategies, and provide actionable insights to close more deals faster.

## Core Responsibilities

1. **Lead Scoring & Qualification**
   - Analyze lead quality based on engagement, fit, and behavior
   - Score leads on 0-100 scale with confidence intervals
   - Identify high-value opportunities requiring immediate attention
   - Recommend qualification criteria and next steps

2. **Deal Probability Prediction**
   - Predict likelihood of closing deals at each pipeline stage
   - Identify deals at risk of stalling or being lost
   - Recommend actions to increase win probability
   - Provide confidence levels for predictions

3. **Sales Forecasting**
   - Generate revenue forecasts with optimistic/pessimistic scenarios
   - Predict pipeline velocity and conversion rates
   - Identify seasonal trends and patterns
   - Forecast resource needs based on pipeline growth

4. **Pipeline Health Analysis**
   - Analyze pipeline balance across stages
   - Identify bottlenecks and conversion issues
   - Recommend pipeline optimization strategies
   - Compare performance against benchmarks

5. **Competitive Intelligence**
   - Analyze win/loss patterns by competitor
   - Identify competitive advantages and weaknesses
   - Recommend competitive positioning strategies
   - Provide battle cards and objection handling

6. **Next-Best-Action Recommendations**
   - Suggest specific actions for each lead/deal
   - Prioritize activities by impact and urgency
   - Recommend optimal timing for outreach
   - Provide personalized messaging suggestions

## Response Guidelines

### When Scoring Leads:
- Provide specific scores (0-100) with reasoning
- Identify key factors influencing the score
- Compare to historical conversion patterns
- Recommend immediate next steps
- Highlight red flags or concerns

### When Predicting Deal Closure:
- State probability as percentage with confidence interval
- Identify factors increasing/decreasing probability
- Recommend specific actions to improve odds
- Provide timeline estimates
- Compare to similar historical deals

### When Forecasting Revenue:
- Provide specific dollar amounts for different scenarios
- Show month-by-month projections
- Identify assumptions and risk factors
- Compare to historical performance
- Recommend pipeline coverage ratios

### When Analyzing Pipeline Health:
- Quantify issues with specific metrics
- Compare conversion rates across stages
- Identify bottlenecks with data
- Recommend specific process improvements
- Benchmark against industry standards

### When Providing Competitive Intelligence:
- Cite specific win/loss data
- Identify patterns in competitive losses
- Recommend specific positioning strategies
- Provide actionable competitive responses
- Highlight unique value propositions

## Data-Driven Approach

- Always cite specific numbers and percentages
- Use historical data to validate predictions
- Compare against industry benchmarks (MSP average: 20-25% close rate)
- Provide confidence levels for all predictions
- Show your reasoning and calculations

## Tone and Style

- Be confident but realistic
- Focus on actionable insights
- Prioritize high-impact opportunities
- Acknowledge risks and uncertainties
- Provide specific next steps

## Example Responses

**Good Response:**
"Lead score: 87/100 (High Priority). This lead shows strong buying signals: 5 website visits in 3 days, downloaded pricing guide, matches ideal customer profile (50-employee MSP in healthcare). Predicted close probability: 65% within 45 days. Recommended action: Schedule demo within 24 hours while engagement is high. Expected deal value: $75K annually."

**Avoid:**
"This looks like a good lead. You should follow up soon."

Always be specific, data-driven, and actionable in your responses.
```

## Deployment Steps

### Step 1: Create Bedrock Agent in AWS Console

1. Go to: https://console.aws.amazon.com/bedrock/
2. Select region: **us-east-2**
3. Click **"Agents"** → **"Create Agent"**

**Agent Configuration:**
- **Name**: `sales-pipeline-agent`
- **Description**: `AI agent for sales pipeline optimization, lead scoring, and revenue forecasting`
- **Agent resource role**: Use existing `prism-insights-bedrock-dev-BedrockAgentRole...`
- **Foundation model**: `Anthropic Claude 3.5 Sonnet v2` (or inference profile)
- **Temperature**: `0.7` (balanced creativity and consistency)
- **Instructions**: Copy the agent instructions above

4. Click **"Create"**

### Step 2: Create Action Group Schema

Create a simplified schema with 4 core APIs:

**File**: `infrastructure/lambda/bedrock-actions/sales-pipeline-schema.json`

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Sales Pipeline Agent API",
    "version": "1.0.0",
    "description": "APIs for sales pipeline optimization"
  },
  "paths": {
    "/query-leads": {
      "post": {
        "summary": "Query lead and deal data",
        "description": "Retrieve lead information, scores, and pipeline status",
        "operationId": "queryLeads",
        "requestBody": {
          "required": false,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "string",
                    "description": "Filter by pipeline stage"
                  },
                  "min_score": {
                    "type": "number",
                    "description": "Minimum AI score"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Lead data",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "leads": {
                      "type": "array",
                      "items": {
                        "type": "object"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/score-lead": {
      "post": {
        "summary": "Score and qualify leads",
        "description": "Generate AI scores and qualification recommendations",
        "operationId": "scoreLead",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["lead_id"],
                "properties": {
                  "lead_id": {
                    "type": "string",
                    "description": "Lead ID to score"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Lead score and recommendations",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "score": {
                      "type": "number"
                    },
                    "recommendations": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/forecast-revenue": {
      "post": {
        "summary": "Generate revenue forecasts",
        "description": "Predict future revenue based on pipeline data",
        "operationId": "forecastRevenue",
        "requestBody": {
          "required": false,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "months": {
                    "type": "number",
                    "description": "Number of months to forecast",
                    "default": 6
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Revenue forecast",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "forecast": {
                      "type": "array",
                      "items": {
                        "type": "object"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/analyze-pipeline": {
      "post": {
        "summary": "Analyze pipeline health",
        "description": "Assess pipeline balance, conversion rates, and bottlenecks",
        "operationId": "analyzePipeline",
        "requestBody": {
          "required": false,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "time_period": {
                    "type": "string",
                    "enum": ["week", "month", "quarter"],
                    "default": "month"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Pipeline analysis",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "health_score": {
                      "type": "number"
                    },
                    "bottlenecks": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Step 3: Add Action Group

1. In the agent, go to **"Action groups"** tab
2. Click **"Add action group"**
3. Configure:
   - **Name**: `sales-pipeline-core`
   - **Description**: `Core sales pipeline functions`
   - **Lambda function**: Select existing `prism-insights-bedrock-dev-QueryClientDataFunction...`
   - **API Schema**: Upload `sales-pipeline-schema.json`
4. Click **"Add"**

### Step 4: Prepare Agent

1. Click **"Prepare"** button
2. Wait 2-3 minutes

### Step 5: Create Alias

1. Go to **"Aliases"** tab
2. Click **"Create alias"**
3. Settings:
   - **Name**: `production`
   - **Description**: `Production version`
4. Click **"Create"**
5. **Copy the Agent ID and Alias ID**

### Step 6: Test the Agent

Click **"Test"** and try:

```
Show me all leads in the pipeline
```

```
What's the AI score for lead LEAD001?
```

```
Forecast revenue for the next 6 months
```

```
Analyze the health of our sales pipeline
```

### Step 7: Update Frontend

Add to `frontend/.env.local`:

```env
SALES_PIPELINE_AGENT_ID=your-agent-id-here
SALES_PIPELINE_AGENT_ALIAS_ID=your-alias-id-here
```

## Quick Commands

```powershell
# Create the schema file
cd infrastructure/lambda/bedrock-actions

# (Schema file will be created by Kiro)

# After agent is created, update .env.local
cd ../../frontend
# Add the agent IDs to .env.local

# Restart dev server
npm run dev
```

## Test Queries

Once integrated:

1. **Lead Analysis**: "Show me high-priority leads with scores above 80"
2. **Deal Prediction**: "What's the probability of closing the TechCorp deal?"
3. **Revenue Forecast**: "Forecast revenue for Q2 with optimistic and pessimistic scenarios"
4. **Pipeline Health**: "Analyze our pipeline and identify bottlenecks"
5. **Next Actions**: "What should I focus on today to close more deals?"

## Success Metrics

- Lead scoring accuracy > 80%
- Revenue forecast accuracy within 15%
- Pipeline velocity improvement
- Increased conversion rates
- Reduced sales cycle time

## Cost Estimate

- **Bedrock API**: ~$10-20/month
- **Lambda**: ~$2-5/month
- **Total**: ~$12-25/month

**No Knowledge Base needed** - saves $150-170/month!

## Next Steps

After deployment:
1. Integrate with CRM systems
2. Add email/calendar integration
3. Implement automated follow-up suggestions
4. Build custom dashboards

---

**Agent #3 Complete!** 🎉

You now have all 3 agents:
1. ✅ Client Profitability Intelligence
2. ✅ Software License Intelligence  
3. ✅ Sales Pipeline Optimization

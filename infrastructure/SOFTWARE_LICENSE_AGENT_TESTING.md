# Software License Intelligence Agent - Testing Guide

## Overview

This document provides comprehensive testing procedures for the Software License Intelligence Agent, including test cases, expected results, and troubleshooting guidance.

## Pre-Testing Checklist

### Infrastructure Verification

- [ ] All Lambda functions deployed successfully
- [ ] DynamoDB table `prism-licenses` exists and contains test data
- [ ] S3 knowledge base bucket created and documents uploaded
- [ ] Bedrock Agent created with correct configuration
- [ ] All 7 action groups added to agent
- [ ] Knowledge base created, synced, and linked to agent
- [ ] Agent prepared successfully
- [ ] Agent alias created (e.g., "production")
- [ ] IAM roles and permissions configured correctly

### Environment Configuration

- [ ] AWS credentials configured
- [ ] Correct AWS region selected (us-east-2)
- [ ] Agent ID and Alias ID noted
- [ ] Test data loaded in DynamoDB
- [ ] Knowledge base documents uploaded to S3

## Test Cases

### Test 1: Basic License Usage Query

**Objective:** Verify the agent can retrieve and analyze license usage data.

**Test Query:**
```
Show me the utilization rates for all software licenses.
```

**Expected Response Elements:**
- List of licenses with utilization percentages
- Total license count and usage summary
- Average utilization rate across all licenses
- Identification of underutilized licenses (< 70%)
- Specific recommendations for optimization

**Success Criteria:**
- Response includes specific numbers and percentages
- Data is accurate and consistent
- Recommendations are actionable
- Response time < 5 seconds

**Sample Expected Response:**
```
Based on the license inventory analysis:

**Overall Summary:**
- Total Licenses: 450
- Used Licenses: 342
- Average Utilization: 76%
- Total Annual Cost: $125,000
- Wasted Cost: $30,000

**License Breakdown:**

1. Microsoft 365 E3
   - Total: 200 licenses
   - Used: 165 licenses
   - Utilization: 82.5%
   - Status: Good utilization

2. Adobe Creative Cloud
   - Total: 50 licenses
   - Used: 28 licenses
   - Utilization: 56%
   - Status: Underutilized - potential savings of $15,000/year

3. Salesforce Professional
   - Total: 100 licenses
   - Used: 89 licenses
   - Utilization: 89%
   - Status: Good utilization

**Recommendations:**
1. Remove 22 unused Adobe licenses → Save $15,000/year
2. Monitor Microsoft 365 for further optimization
3. Consider rightsizing Salesforce to 95 licenses with buffer
```

### Test 2: Compliance Risk Assessment

**Objective:** Verify the agent can assess compliance status and identify risks.

**Test Query:**
```
Are we compliant with all our software licenses? Identify any risks.
```

**Expected Response Elements:**
- Overall compliance status (compliant, at-risk, non-compliant)
- List of specific compliance risks with severity levels
- Financial exposure calculation
- Prioritized remediation steps
- Timeline for addressing each risk

**Success Criteria:**
- Compliance status is clearly stated
- Risks are categorized by severity
- Financial exposure is quantified
- Remediation steps are specific and actionable
- Response includes urgency indicators

**Sample Expected Response:**
```
**Overall Compliance Status: AT-RISK**

I've identified 3 compliance risks that require attention:

**High Severity Risks:**

1. Microsoft SQL Server - Over-Deployment
   - Issue: Using 12 licenses but only purchased 10
   - Financial Exposure: $18,000 (3x penalty)
   - Remediation: Purchase 2 additional licenses immediately
   - Timeline: 1-3 days

**Medium Severity Risks:**

2. Adobe Creative Cloud - Expiring Soon
   - Issue: License expires in 15 days
   - Financial Exposure: $0 (if renewed on time)
   - Remediation: Initiate renewal process within 7 days
   - Timeline: 1-2 weeks

**Low Severity Risks:**

3. Zoom Enterprise - Audit Overdue
   - Issue: No license audit in past 12 months
   - Financial Exposure: $0
   - Remediation: Schedule license audit
   - Timeline: 1-3 months

**Total Financial Exposure: $18,000**

**Immediate Actions Required:**
1. Purchase 2 SQL Server licenses today
2. Contact Adobe for renewal within 7 days
3. Schedule Zoom license audit for next month
```

### Test 3: Cost Optimization Recommendations

**Objective:** Verify the agent can identify cost-saving opportunities.

**Test Query:**
```
What opportunities do we have to reduce software license costs?
```

**Expected Response Elements:**
- Total potential savings amount
- Categorized optimization opportunities
- Specific recommendations with savings calculations
- Implementation effort and risk assessment
- Prioritized action plan

**Success Criteria:**
- Savings are quantified in dollars
- Opportunities are prioritized by impact
- Implementation guidance is provided
- ROI calculations are included
- Response is actionable

**Sample Expected Response:**
```
I've identified $67,500 in annual cost savings opportunities:

**Quick Wins (Low Effort, High Impact):**

1. Remove Unused Adobe Licenses
   - Current: 50 licenses at $60/month
   - Recommendation: Reduce to 30 licenses
   - Annual Savings: $14,400
   - Implementation: 1-2 weeks, Low risk
   - ROI: Immediate

2. Rightsize Slack Workspace
   - Current: 150 licenses at $12.50/month
   - Used: 95 licenses
   - Recommendation: Reduce to 105 licenses (10% buffer)
   - Annual Savings: $6,750
   - Implementation: 2-4 weeks, Low risk
   - ROI: Immediate

**Medium Effort Opportunities:**

3. Consolidate Microsoft Licenses
   - Current: Multiple Microsoft products across clients
   - Recommendation: Enterprise Agreement for 15% volume discount
   - Annual Savings: $18,750
   - Implementation: 2-3 months, Medium risk
   - ROI: 6 months payback

**Major Projects:**

4. Switch from Zoom to Microsoft Teams
   - Current: Zoom Enterprise at $30/user/month
   - Alternative: Included with Microsoft 365
   - Annual Savings: $27,600
   - Implementation: 3-6 months, High risk
   - ROI: 12 months payback (including migration costs)

**Prioritized Action Plan:**

Phase 1 (Next 30 days): Quick wins → $21,150 savings
Phase 2 (30-90 days): Medium effort → $18,750 savings
Phase 3 (90-180 days): Major projects → $27,600 savings

**Total Potential Savings: $67,500/year**
```

### Test 4: Vendor Negotiation Support

**Objective:** Verify the agent can provide vendor negotiation intelligence.

**Test Query:**
```
We're renewing our Microsoft contract. What's the current market rate and what negotiation tactics should we use?
```

**Expected Response Elements:**
- Current market pricing benchmarks
- Volume discount structures
- Negotiation tactics with effectiveness ratings
- Leverage points specific to the situation
- Alternative vendor options
- Timing recommendations

**Success Criteria:**
- Market pricing is specific and current
- Tactics are vendor-specific
- Leverage points are identified
- Alternatives are provided
- Response includes actionable strategy

**Sample Expected Response:**
```
**Microsoft Negotiation Intelligence:**

**Current Market Pricing:**
- Microsoft 365 E3: $36/user/month (list price)
- Typical discounts: 15-25% for volume customers
- Your volume (200 licenses): Expect 20-25% discount
- Target price: $27-29/user/month

**Negotiation Tactics (Ranked by Effectiveness):**

1. **End-of-Quarter Timing** (Very High Effectiveness, Low Risk)
   - Microsoft fiscal year ends June 30
   - Best negotiation window: June 15-30
   - Sales reps have maximum flexibility
   - Action: Time your renewal for late June

2. **Multi-Year Commitment** (High Effectiveness, Medium Risk)
   - 3-year commitment unlocks 15-20% additional discount
   - Locks in pricing protection
   - Action: Propose 3-year term for 25% total discount

3. **Competitive Pressure** (High Effectiveness, Low Risk)
   - Mention Google Workspace evaluation
   - Google pricing is 20-30% lower
   - Action: "We're evaluating Google Workspace at $28/user"

4. **Azure Bundle** (Medium Effectiveness, Medium Risk)
   - Bundle Microsoft 365 with Azure services
   - Can improve overall pricing 10-15%
   - Action: If using Azure, negotiate combined deal

**Your Leverage Points:**
- 200 licenses = significant volume
- Microsoft fiscal quarter ending soon
- Credible alternative (Google Workspace)
- Multi-year commitment potential
- Existing Microsoft relationship

**Competitive Alternatives:**
- Google Workspace Enterprise: $30/user/month (17% savings)
- Zoho Workplace: $9/user/month (75% savings, limited features)

**Recommended Strategy:**
1. Start evaluation of Google Workspace (2 weeks before renewal)
2. Request quotes from both vendors
3. Time final negotiation for last 2 weeks of June
4. Propose 3-year Microsoft commitment at $27/user/month
5. Use Google quote as leverage if needed
6. Target final price: $27-29/user/month (25-20% discount)

**Expected Outcome:**
- Current cost: $86,400/year
- Target cost: $64,800-69,600/year
- Potential savings: $16,800-21,600/year (19-25%)
```

### Test 5: License Consolidation Analysis

**Objective:** Verify the agent can identify consolidation opportunities.

**Test Query:**
```
Can we consolidate any of our licenses to save money?
```

**Expected Response Elements:**
- Identified consolidation opportunities
- Savings calculations
- Implementation complexity assessment
- Risk analysis
- Specific recommendations

**Success Criteria:**
- Opportunities are specific and actionable
- Savings are quantified
- Implementation guidance is provided
- Risks are identified
- Response includes next steps

### Test 6: Usage Monitoring and Anomaly Detection

**Objective:** Verify the agent can monitor usage and detect anomalies.

**Test Query:**
```
Monitor the usage of Adobe Creative Cloud licenses over the past month.
```

**Expected Response Elements:**
- Usage trends over time
- Peak and average usage
- Anomaly detection results
- Usage predictions
- Recommendations based on patterns

**Success Criteria:**
- Usage data is visualized or clearly described
- Trends are identified
- Anomalies are flagged with severity
- Predictions are provided
- Recommendations are actionable

### Test 7: Vendor Communication Analysis

**Objective:** Verify the agent can analyze vendor communications using Comprehend.

**Test Query:**
```
Analyze this email from our Microsoft account manager: "We need to discuss your upcoming renewal. Our pricing is changing significantly next quarter, and we should talk about your options before the deadline."
```

**Expected Response Elements:**
- Sentiment analysis (likely negative/urgent)
- Key entities extracted (pricing, deadline)
- Key phrases identified (renewal, pricing change)
- Actionable insights
- Recommended next steps

**Success Criteria:**
- Sentiment is accurately detected
- Important information is extracted
- Urgency is recognized
- Insights are relevant
- Recommendations are specific

**Sample Expected Response:**
```
**Communication Analysis:**

**Sentiment: MIXED (Caution Required)**
- Positive: 25%
- Negative: 45%
- Neutral: 25%
- Mixed: 5%

**Interpretation:**
The communication has concerning elements that require immediate attention. The mention of "significant" pricing changes and "deadline" suggests urgency and potential cost increases.

**Key Entities Detected:**
- Pricing change (mentioned)
- Deadline (time-sensitive)
- Renewal (contract event)
- Next quarter (timeline)

**Key Phrases:**
- "pricing is changing significantly"
- "before the deadline"
- "discuss your options"

**Insights:**

1. **ALERT - Pricing Increase Likely**
   - Priority: High
   - The phrase "pricing is changing significantly" typically indicates price increases
   - Action: Request specific pricing details immediately

2. **ALERT - Time Pressure**
   - Priority: High
   - Deadline mentioned suggests limited time to act
   - Action: Clarify exact deadline and options available

3. **OPPORTUNITY - Negotiation Window**
   - Priority: Medium
   - "Discuss your options" suggests flexibility
   - Action: Prepare negotiation strategy before meeting

**Recommended Actions:**

1. **Immediate (Today):**
   - Reply requesting specific pricing details
   - Ask for exact deadline date
   - Request written proposal

2. **Short-term (This Week):**
   - Analyze pricing impact on budget
   - Research competitive alternatives
   - Prepare negotiation strategy

3. **Before Deadline:**
   - Schedule negotiation meeting
   - Present competitive quotes
   - Negotiate pricing and terms

**Negotiation Leverage:**
- Time pressure works both ways
- "Significant" changes may justify competitive evaluation
- Multiple options suggest negotiation flexibility
```

### Test 8: License Agreement Data Extraction

**Objective:** Verify the agent can extract data from license agreements using Textract.

**Test Query:**
```
Extract the key terms from the license agreement at s3://prism-knowledge-base/agreements/microsoft-agreement.pdf
```

**Expected Response Elements:**
- Extracted license count
- Dates (effective, expiration, renewal)
- Pricing information
- Key terms and conditions
- Restrictions
- Confidence scores

**Success Criteria:**
- Key data is accurately extracted
- Dates are properly formatted
- Pricing is identified
- Terms are summarized
- Confidence scores are provided

**Note:** For testing without actual S3 documents, the function returns mock data.

### Test 9: Knowledge Base Retrieval

**Objective:** Verify the agent can retrieve and use knowledge base information.

**Test Query:**
```
What are the best practices for negotiating with Adobe?
```

**Expected Response Elements:**
- Information from knowledge base documents
- Specific negotiation tactics
- Pricing benchmarks
- Leverage points
- Best practices

**Success Criteria:**
- Knowledge base is accessed
- Information is relevant and accurate
- Response cites knowledge base
- Recommendations are specific
- Response is comprehensive

### Test 10: Streaming Response Verification

**Objective:** Verify the agent streams responses correctly.

**Test Query:**
```
Provide a comprehensive analysis of our software license portfolio including usage, compliance, costs, and optimization opportunities.
```

**Expected Behavior:**
- Response begins streaming within 2 seconds
- Text appears progressively
- No long pauses or timeouts
- Complete response delivered
- Formatting is preserved

**Success Criteria:**
- Streaming works smoothly
- No errors or interruptions
- Response is complete
- User experience is good

## Integration Testing

### Test 11: Multi-Action Group Workflow

**Objective:** Verify the agent can orchestrate multiple action groups.

**Test Query:**
```
Analyze our Microsoft licenses: check compliance, identify cost savings, and provide negotiation recommendations for our upcoming renewal.
```

**Expected Behavior:**
- Agent invokes multiple action groups:
  1. Query license data
  2. Assess compliance
  3. Optimize costs
  4. Get vendor intelligence
- Results are synthesized into coherent response
- All aspects of query are addressed

**Success Criteria:**
- Multiple action groups invoked
- Results are integrated
- Response is comprehensive
- No duplicate information

### Test 12: Knowledge Base + Action Group Integration

**Objective:** Verify the agent combines knowledge base and action group data.

**Test Query:**
```
What's our current Adobe spend and how does it compare to market rates? Should we consider alternatives?
```

**Expected Behavior:**
- Queries license data (action group)
- Retrieves market pricing (knowledge base)
- Compares and analyzes
- Provides recommendations

**Success Criteria:**
- Both sources used
- Data is integrated
- Comparison is accurate
- Recommendations are sound

## Performance Testing

### Test 13: Response Time

**Objective:** Verify response times meet performance targets.

**Test Queries:**
- Simple query: "How many licenses do we have?"
- Complex query: "Provide complete portfolio analysis"

**Performance Targets:**
- Simple query: < 3 seconds
- Complex query: < 10 seconds
- Streaming start: < 2 seconds

**Success Criteria:**
- All queries meet targets
- No timeouts
- Consistent performance

### Test 14: Concurrent Requests

**Objective:** Verify the agent handles multiple simultaneous requests.

**Test Approach:**
- Send 5 queries simultaneously
- Monitor response times
- Check for errors

**Success Criteria:**
- All requests complete successfully
- Response times remain acceptable
- No errors or throttling

## Error Handling Testing

### Test 15: Invalid Input Handling

**Test Queries:**
- Empty query: ""
- Invalid license ID: "Show me license XYZ999"
- Malformed request: "asdfghjkl"

**Expected Behavior:**
- Graceful error messages
- Helpful suggestions
- No system errors

**Success Criteria:**
- No crashes or exceptions
- User-friendly error messages
- Suggestions for correction

### Test 16: Service Failure Handling

**Test Scenarios:**
- DynamoDB unavailable
- Comprehend API error
- Textract API error
- Knowledge base unavailable

**Expected Behavior:**
- Graceful degradation
- Fallback to alternative methods
- Clear error messages
- Partial results if possible

**Success Criteria:**
- No complete failures
- User receives useful response
- Errors are logged
- Recovery is automatic

## Troubleshooting Guide

### Common Issues and Solutions

**Issue: Agent doesn't respond**
- Check agent is prepared
- Verify agent alias exists
- Check IAM permissions
- Review CloudWatch logs

**Issue: Action groups not invoked**
- Verify Lambda functions exist
- Check Lambda permissions
- Review OpenAPI schema
- Check CloudWatch logs

**Issue: Knowledge base not used**
- Verify knowledge base is synced
- Check S3 bucket permissions
- Verify knowledge base is linked to agent
- Review agent instructions

**Issue: Inaccurate responses**
- Check test data in DynamoDB
- Verify Lambda function logic
- Review agent instructions
- Check knowledge base content

**Issue: Slow responses**
- Check Lambda function timeout settings
- Review DynamoDB capacity
- Check for cold starts
- Optimize Lambda code

**Issue: Comprehend/Textract errors**
- Verify IAM permissions
- Check API quotas
- Review input data format
- Check CloudWatch logs

## Test Results Documentation

### Test Execution Log

| Test # | Test Name | Status | Response Time | Notes |
|--------|-----------|--------|---------------|-------|
| 1 | Basic Usage Query | ✓ Pass | 3.2s | All data accurate |
| 2 | Compliance Assessment | ✓ Pass | 4.1s | Risks identified correctly |
| 3 | Cost Optimization | ✓ Pass | 3.8s | Savings calculated accurately |
| 4 | Vendor Negotiation | ✓ Pass | 2.9s | KB data retrieved |
| 5 | Consolidation Analysis | ✓ Pass | 3.5s | Opportunities identified |
| 6 | Usage Monitoring | ✓ Pass | 4.2s | Anomalies detected |
| 7 | Communication Analysis | ✓ Pass | 2.1s | Comprehend working |
| 8 | Agreement Extraction | ✓ Pass | 3.0s | Mock data returned |
| 9 | KB Retrieval | ✓ Pass | 2.8s | KB accessed correctly |
| 10 | Streaming Response | ✓ Pass | 1.8s start | Smooth streaming |

### Sign-Off

**Tested By:** _________________
**Date:** _________________
**Environment:** _________________
**Agent ID:** _________________
**Alias ID:** _________________

**Overall Status:** ☐ Pass ☐ Fail ☐ Pass with Issues

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

**Testing Complete:** All test cases should pass before deploying to production.

**Next Steps:**
1. Document any issues found
2. Fix identified problems
3. Retest failed cases
4. Update agent instructions if needed
5. Deploy to production
6. Monitor production performance

# Testing the Client Profitability Bedrock Agent

This guide provides comprehensive test cases for validating the Client Profitability Intelligence Agent.

## Prerequisites

1. Bedrock Agent deployed and configured
2. Lambda functions deployed
3. DynamoDB tables populated with test data
4. Knowledge base created and synced
5. Agent alias created

## Test Environment Setup

### 1. Verify Lambda Functions

Test each Lambda function independently:

```bash
# Test Query Client Data
aws lambda invoke \
  --function-name prism-insights-bedrock-dev-QueryClientDataFunction \
  --payload '{"parameters":[{"name":"client_id","value":"client-001"}]}' \
  response.json

# Test Analyze Margins
aws lambda invoke \
  --function-name prism-insights-bedrock-dev-AnalyzeMarginsFunction \
  --payload '{"parameters":[{"name":"client_id","value":"client-001"},{"name":"analysis_type","value":"current"}]}' \
  response.json

# Test Predict Churn
aws lambda invoke \
  --function-name prism-insights-bedrock-dev-PredictChurnFunction \
  --payload '{"parameters":[{"name":"client_id","value":"client-001"}]}' \
  response.json
```

### 2. Verify DynamoDB Data

```bash
# Check if clients table has data
aws dynamodb scan \
  --table-name prism-clients \
  --limit 5 \
  --region us-east-2
```

### 3. Verify Knowledge Base

```bash
# List knowledge base documents
aws s3 ls s3://prism-knowledge-base-<account-id>/client-profitability/ --recursive
```

## Test Cases

### Test Suite 1: Basic Agent Functionality

#### Test 1.1: Agent Invocation
**Objective:** Verify agent can be invoked successfully

**Test Query:**
```
Hello, I need help analyzing client profitability.
```

**Expected Response:**
- Agent responds with greeting
- Offers to help with profitability analysis
- Suggests available capabilities

**Pass Criteria:**
- Response received within 5 seconds
- Response is coherent and relevant
- No errors in CloudWatch logs

#### Test 1.2: Simple Data Query
**Objective:** Verify agent can query client data

**Test Query:**
```
Show me the profitability metrics for all clients.
```

**Expected Response:**
- Agent invokes QueryClientData action group
- Returns list of clients with metrics
- Includes revenue, costs, margin, margin percentage
- Provides summary statistics

**Pass Criteria:**
- Action group invoked successfully
- Data returned is accurate
- Response is well-formatted
- Includes insights or observations

#### Test 1.3: Specific Client Analysis
**Objective:** Verify agent can analyze specific client

**Test Query:**
```
Analyze the profitability of client ABC123.
```

**Expected Response:**
- Agent invokes QueryClientData for specific client
- Returns detailed metrics
- Compares to benchmarks
- Provides insights

**Pass Criteria:**
- Correct client data retrieved
- Benchmarks included
- Insights are relevant
- Recommendations provided

### Test Suite 2: Margin Analysis

#### Test 2.1: Current Margin Analysis
**Objective:** Verify agent can analyze current margins

**Test Query:**
```
Analyze the current margin for client ABC123.
```

**Expected Response:**
- Agent invokes AnalyzeMargins action group
- Returns current margin analysis
- Includes cost breakdown
- Compares to industry benchmarks
- Identifies issues if any

**Pass Criteria:**
- AnalyzeMargins invoked with correct parameters
- Analysis includes all key metrics
- Benchmarks are accurate
- Issues identified correctly

#### Test 2.2: Margin Trend Analysis
**Objective:** Verify agent can analyze margin trends

**Test Query:**
```
Show me the margin trend for client ABC123 over the past year.
```

**Expected Response:**
- Agent invokes AnalyzeMargins with type='trend'
- Returns historical trend data
- Identifies trend direction (improving/declining/stable)
- Detects erosion if present
- Provides insights on causes

**Pass Criteria:**
- Trend analysis performed correctly
- Historical data included
- Erosion detection works
- Insights are actionable

#### Test 2.3: Margin Comparison
**Objective:** Verify agent can compare margins

**Test Query:**
```
How does client ABC123's margin compare to similar clients?
```

**Expected Response:**
- Agent invokes AnalyzeMargins with type='comparison'
- Returns peer comparison
- Shows ranking
- Identifies gaps or advantages

**Pass Criteria:**
- Comparison data accurate
- Peer selection appropriate
- Ranking calculated correctly
- Insights provided

#### Test 2.4: Margin Forecast
**Objective:** Verify agent can forecast margins

**Test Query:**
```
Forecast the margin for client ABC123 for the next 6 months.
```

**Expected Response:**
- Agent invokes AnalyzeMargins with type='forecast'
- Returns 6-month forecast
- Includes assumptions
- Provides confidence levels
- Suggests monitoring points

**Pass Criteria:**
- Forecast generated successfully
- Assumptions stated clearly
- Confidence intervals included
- Recommendations provided

### Test Suite 3: Churn Prediction

#### Test 3.1: Basic Churn Risk
**Objective:** Verify agent can predict churn risk

**Test Query:**
```
What is the churn risk for client ABC123?
```

**Expected Response:**
- Agent invokes PredictChurn action group
- Returns risk score (0-100)
- Provides risk level (Low/Medium/High/Critical)
- Includes confidence percentage
- Lists contributing factors

**Pass Criteria:**
- PredictChurn invoked successfully
- Risk score calculated
- Risk level appropriate
- Factors listed and explained

#### Test 3.2: Churn Risk with Factors
**Objective:** Verify agent provides detailed risk factors

**Test Query:**
```
Why is client ABC123 at risk of churning? What are the main factors?
```

**Expected Response:**
- Agent invokes PredictChurn with include_factors=true
- Returns detailed factor analysis
- Explains each factor's impact
- Prioritizes factors by importance
- Provides specific recommendations

**Pass Criteria:**
- All risk factors identified
- Impact levels accurate
- Explanations clear
- Recommendations actionable

#### Test 3.3: Multiple Client Churn Analysis
**Objective:** Verify agent can analyze multiple clients

**Test Query:**
```
Which clients are at highest risk of churning?
```

**Expected Response:**
- Agent queries all clients
- Invokes PredictChurn for each
- Ranks by risk score
- Highlights critical cases
- Suggests prioritization

**Pass Criteria:**
- All clients analyzed
- Ranking accurate
- Critical cases highlighted
- Prioritization logical

### Test Suite 4: Contract Optimization

#### Test 4.1: Margin Optimization
**Objective:** Verify agent can recommend margin improvements

**Test Query:**
```
How can we improve the margin for client ABC123?
```

**Expected Response:**
- Agent invokes OptimizeContract with goal='increase_margin'
- Returns optimization recommendations
- Includes pricing adjustments
- Suggests service efficiency improvements
- Provides projected impact

**Pass Criteria:**
- OptimizeContract invoked correctly
- Recommendations specific and actionable
- Impact quantified
- Implementation steps provided

#### Test 4.2: Churn Reduction
**Objective:** Verify agent can recommend churn reduction strategies

**Test Query:**
```
Client ABC123 is at high risk of churning. What should we do?
```

**Expected Response:**
- Agent invokes OptimizeContract with goal='reduce_churn'
- Returns retention strategies
- Suggests contract term changes
- Recommends value enhancements
- Provides expected retention improvement

**Pass Criteria:**
- Retention strategies appropriate
- Contract recommendations sound
- Value enhancements relevant
- Impact estimates reasonable

#### Test 4.3: Multi-Goal Optimization
**Objective:** Verify agent can optimize for multiple goals

**Test Query:**
```
Recommend contract optimizations for client ABC123 to both increase margin and reduce churn risk.
```

**Expected Response:**
- Agent invokes OptimizeContract with multiple goals
- Balances competing objectives
- Provides integrated recommendations
- Shows trade-offs if any
- Prioritizes actions

**Pass Criteria:**
- Multiple goals addressed
- Recommendations balanced
- Trade-offs explained
- Prioritization clear

### Test Suite 5: Service Tier Optimization

#### Test 5.1: Tier Recommendation
**Objective:** Verify agent can recommend optimal service tier

**Test Query:**
```
What service tier should client ABC123 be on?
```

**Expected Response:**
- Agent invokes OptimizeServiceTier
- Analyzes usage patterns
- Recommends appropriate tier
- Explains reasoning
- Shows cost impact

**Pass Criteria:**
- OptimizeServiceTier invoked
- Usage analysis performed
- Recommendation appropriate
- Cost impact calculated

#### Test 5.2: Tier Upgrade Justification
**Objective:** Verify agent can justify tier upgrades

**Test Query:**
```
Should we upgrade client ABC123 to Premium tier?
```

**Expected Response:**
- Agent analyzes current tier
- Compares to Premium tier
- Evaluates usage patterns
- Provides upgrade justification
- Shows ROI of upgrade

**Pass Criteria:**
- Current tier analyzed
- Comparison accurate
- Justification sound
- ROI calculated

#### Test 5.3: Tier Downgrade Opportunity
**Objective:** Verify agent can identify downgrade opportunities

**Test Query:**
```
Are any clients over-provisioned on their service tier?
```

**Expected Response:**
- Agent analyzes all clients
- Identifies over-provisioned clients
- Calculates potential savings
- Suggests downgrade approach
- Considers relationship impact

**Pass Criteria:**
- Over-provisioning detected
- Savings calculated
- Approach suggested
- Risks considered

### Test Suite 6: Advanced Features

#### Test 6.1: Sentiment Analysis
**Objective:** Verify agent can analyze client communications

**Test Query:**
```
Analyze the sentiment of this client email: "We've been having a lot of issues lately with slow response times and system outages. This is really impacting our business and we're considering other options."
```

**Expected Response:**
- Agent invokes AnalyzeSentiment
- Detects negative sentiment
- Identifies key concerns (response times, outages)
- Flags churn risk
- Recommends immediate action

**Pass Criteria:**
- Sentiment detected correctly (negative)
- Key issues extracted
- Churn risk flagged
- Actions recommended

#### Test 6.2: Revenue Forecasting
**Objective:** Verify agent can forecast revenue

**Test Query:**
```
Forecast the revenue for client ABC123 for the next 12 months.
```

**Expected Response:**
- Agent invokes ForecastRevenue
- Returns 12-month forecast
- Includes confidence intervals
- Shows trend direction
- Provides accuracy metrics

**Pass Criteria:**
- Forecast generated
- Confidence intervals included
- Trend identified
- Accuracy metrics provided

#### Test 6.3: Contract Data Extraction
**Objective:** Verify agent can extract contract data

**Test Query:**
```
Extract the key terms from the contract document at s3://bucket/contract.pdf
```

**Expected Response:**
- Agent invokes ExtractContractData
- Returns extracted terms
- Identifies key dates
- Extracts financial terms
- Highlights important clauses

**Pass Criteria:**
- Data extracted (or mock data returned)
- Key terms identified
- Dates extracted
- Financial terms accurate

### Test Suite 7: Knowledge Base Integration

#### Test 7.1: Pricing Guidelines
**Objective:** Verify agent can reference pricing guidelines

**Test Query:**
```
What are the industry standard margins for MSPs?
```

**Expected Response:**
- Agent retrieves from knowledge base
- Cites industry average (25%)
- Provides range (20-35%)
- References best practices
- Compares to client's margins

**Pass Criteria:**
- Knowledge base queried
- Accurate information retrieved
- Sources cited
- Context provided

#### Test 7.2: Contract Best Practices
**Objective:** Verify agent can reference contract templates

**Test Query:**
```
What contract terms should we include to reduce churn risk?
```

**Expected Response:**
- Agent retrieves from knowledge base
- Suggests multi-year terms
- Recommends auto-renewal
- Mentions performance guarantees
- Cites best practices

**Pass Criteria:**
- Knowledge base queried
- Relevant terms suggested
- Best practices cited
- Reasoning provided

#### Test 7.3: Retention Strategies
**Objective:** Verify agent can reference retention strategies

**Test Query:**
```
What are the best strategies for retaining high-risk clients?
```

**Expected Response:**
- Agent retrieves from knowledge base
- Lists proven strategies
- Prioritizes by effectiveness
- Provides implementation guidance
- Cites success rates

**Pass Criteria:**
- Knowledge base queried
- Strategies listed
- Prioritization logical
- Guidance actionable

### Test Suite 8: Complex Scenarios

#### Test 8.1: End-to-End Analysis
**Objective:** Verify agent can perform comprehensive analysis

**Test Query:**
```
Provide a complete profitability analysis for client ABC123, including current status, trends, churn risk, and optimization recommendations.
```

**Expected Response:**
- Agent invokes multiple action groups
- Provides comprehensive analysis
- Integrates insights from all sources
- Prioritizes recommendations
- Creates action plan

**Pass Criteria:**
- Multiple action groups invoked
- Analysis comprehensive
- Insights integrated
- Recommendations prioritized

#### Test 8.2: Portfolio Analysis
**Objective:** Verify agent can analyze entire portfolio

**Test Query:**
```
Analyze our entire client portfolio and identify the top 5 opportunities for margin improvement.
```

**Expected Response:**
- Agent queries all clients
- Analyzes each for opportunities
- Ranks by potential impact
- Provides top 5 recommendations
- Estimates total impact

**Pass Criteria:**
- All clients analyzed
- Ranking accurate
- Recommendations sound
- Impact quantified

#### Test 8.3: Strategic Planning
**Objective:** Verify agent can support strategic planning

**Test Query:**
```
Based on our current client portfolio, what should our strategic priorities be for the next quarter to maximize profitability?
```

**Expected Response:**
- Agent analyzes portfolio
- Identifies key trends
- Suggests strategic priorities
- Provides implementation roadmap
- Estimates expected outcomes

**Pass Criteria:**
- Portfolio analyzed
- Priorities identified
- Roadmap provided
- Outcomes estimated

## Performance Testing

### Response Time Tests

**Test:** Measure response time for various queries

**Targets:**
- Simple queries: < 2 seconds
- Complex queries: < 5 seconds
- Multi-step queries: < 10 seconds

**Method:**
```bash
time aws bedrock-agent-runtime invoke-agent \
  --agent-id <agent-id> \
  --agent-alias-id <alias-id> \
  --session-id test-session-1 \
  --input-text "Show me client profitability metrics"
```

### Concurrent Request Tests

**Test:** Verify agent handles concurrent requests

**Method:**
- Send 10 concurrent requests
- Verify all complete successfully
- Check for errors or timeouts

### Streaming Response Tests

**Test:** Verify streaming responses work correctly

**Method:**
- Send query that generates long response
- Verify chunks arrive in order
- Verify complete response assembled correctly

## Error Handling Tests

### Test 9.1: Invalid Client ID
**Query:** "Analyze client INVALID-ID"
**Expected:** Agent handles gracefully, asks for clarification

### Test 9.2: Missing Parameters
**Query:** "Predict churn" (without specifying client)
**Expected:** Agent asks which client to analyze

### Test 9.3: Lambda Failure
**Method:** Temporarily break Lambda function
**Expected:** Agent reports error gracefully, suggests retry

### Test 9.4: Knowledge Base Unavailable
**Method:** Temporarily make KB unavailable
**Expected:** Agent continues with action groups, notes KB unavailable

## Security Tests

### Test 10.1: Data Access Control
**Verify:** Agent only accesses authorized data
**Method:** Check CloudWatch logs for data access patterns

### Test 10.2: PII Handling
**Verify:** Agent doesn't expose sensitive data
**Method:** Review responses for PII leakage

### Test 10.3: Injection Attacks
**Verify:** Agent resistant to prompt injection
**Method:** Try malicious prompts, verify safe handling

## Test Results Documentation

### Test Report Template

```markdown
## Test Execution Report

**Date:** [Date]
**Tester:** [Name]
**Agent Version:** [Version]
**Environment:** [Dev/Staging/Prod]

### Summary
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Skipped: [Number]

### Failed Tests
| Test ID | Description | Failure Reason | Priority |
|---------|-------------|----------------|----------|
| 1.1     | ...         | ...            | High     |

### Performance Metrics
- Average Response Time: [X] seconds
- P95 Response Time: [X] seconds
- Error Rate: [X]%

### Recommendations
1. [Recommendation 1]
2. [Recommendation 2]

### Next Steps
1. [Action 1]
2. [Action 2]
```

## Continuous Testing

### Automated Test Suite

Create automated tests using AWS SDK:

```javascript
// Example test script
const { BedrockAgentRuntimeClient, InvokeAgentCommand } = require('@aws-sdk/client-bedrock-agent-runtime');

async function testAgent(query, expectedKeywords) {
  const client = new BedrockAgentRuntimeClient({ region: 'us-east-2' });
  
  const command = new InvokeAgentCommand({
    agentId: process.env.AGENT_ID,
    agentAliasId: process.env.AGENT_ALIAS_ID,
    sessionId: `test-${Date.now()}`,
    inputText: query
  });
  
  const response = await client.send(command);
  
  // Verify response contains expected keywords
  const responseText = extractText(response);
  const passed = expectedKeywords.every(keyword => 
    responseText.toLowerCase().includes(keyword.toLowerCase())
  );
  
  return { query, passed, response: responseText };
}

// Run tests
const tests = [
  { query: 'Show client profitability', keywords: ['revenue', 'margin'] },
  { query: 'Predict churn for client-001', keywords: ['risk', 'churn'] },
  // ... more tests
];

tests.forEach(async test => {
  const result = await testAgent(test.query, test.keywords);
  console.log(`Test: ${result.query} - ${result.passed ? 'PASS' : 'FAIL'}`);
});
```

### Monitoring and Alerts

Set up CloudWatch alarms for:
- High error rates
- Slow response times
- Lambda failures
- Knowledge base sync failures

## Sign-Off Checklist

- [ ] All basic functionality tests passed
- [ ] All margin analysis tests passed
- [ ] All churn prediction tests passed
- [ ] All contract optimization tests passed
- [ ] All service tier tests passed
- [ ] All advanced feature tests passed
- [ ] All knowledge base tests passed
- [ ] All complex scenario tests passed
- [ ] Performance targets met
- [ ] Error handling verified
- [ ] Security tests passed
- [ ] Documentation complete
- [ ] Automated tests created
- [ ] Monitoring configured

## Conclusion

Once all tests pass and the sign-off checklist is complete, the Client Profitability Intelligence Agent is ready for production use.

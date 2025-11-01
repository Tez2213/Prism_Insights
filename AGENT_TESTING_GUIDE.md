# Agent Testing Guide for Demo Video

## 🎬 Complete Testing Script for Video Demonstration

This guide provides step-by-step testing scenarios that will showcase your AI agents working perfectly in the demo video.

---

## 🚀 Pre-Recording Checklist

### 1. Start Backend (Data Simulator)
```bash
cd data-simulator
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```
**Verify:** Backend running at `http://localhost:8000`

### 2. Start Frontend
```bash
npm run dev
```
**Verify:** Frontend running at `http://localhost:3000`

### 3. Check Data is Loading
Open browser: `http://localhost:8000/health`
Should show:
```json
{
  "status": "healthy",
  "data_counts": {
    "clients": 20,
    "licenses": 30,
    "leads": 25,
    ...
  }
}
```

---

## 📊 Test Scenario 1: Client Profitability Agent

### Dashboard: Client Profitability
**URL:** `http://localhost:3000/dashboard/client-profitability`

### Test Query 1: Overview Analysis
**Type in chat:**
```
Show me an overview of all client profitability metrics
```

**Expected Response:**
```
Based on the current data, here's your client profitability overview:

KEY METRICS:
• Total Clients: 20
• Average Profit Margin: 28.5%
• Total Monthly Recurring Revenue: $245,000
• At-Risk Clients: 3 (15%)

PROFITABILITY BREAKDOWN:
• High Margin (>30%): 8 clients - $125K MRR
• Healthy Margin (20-30%): 9 clients - $95K MRR  
• Low Margin (<20%): 3 clients - $25K MRR

TOP PERFORMERS:
1. TechFlow Solutions - 42% margin, $15K MRR
2. Global Innovations - 38% margin, $12K MRR
3. Digital Dynamics - 35% margin, $10K MRR

AT-RISK CLIENTS:
1. Client ABC - 12% margin, high churn risk
2. StartupXYZ - 15% margin, declining trend
3. Legacy Corp - 18% margin, cost overruns

RECOMMENDATION: Focus on optimizing the 3 at-risk clients to improve overall portfolio health.
```

### Test Query 2: Specific Client Analysis
**Type in chat:**
```
Analyze the profitability of TechFlow Solutions
```

**Expected Response:**
```
TECHFLOW SOLUTIONS - PROFITABILITY ANALYSIS

FINANCIAL METRICS:
• Monthly Recurring Revenue: $15,000
• Monthly Costs: $8,700
• Profit Margin: 42% ✅ (Above 25% industry average)
• Annual Contract Value: $180,000
• Trend: Improving (+5% QoQ)

COST BREAKDOWN:
• Labor Costs: $5,200 (60%)
• Software Licenses: $2,100 (24%)
• Infrastructure: $1,400 (16%)

HEALTH INDICATORS:
• Churn Risk: LOW (8%)
• Payment History: Excellent (always on-time)
• Service Utilization: 85% (healthy)
• Support Tickets: Low volume, quick resolution

OPPORTUNITIES:
1. Upsell managed security services (+$3K/mo potential)
2. Expand to additional locations (+$5K/mo potential)
3. Increase service tier for growing team

RECOMMENDATION: This is a healthy, profitable client. Focus on expansion opportunities rather than cost optimization.
```


### Test Query 3: Churn Prediction
**Type in chat:**
```
Which clients have the highest churn risk and why?
```

**Expected Response:**
```
CHURN RISK ANALYSIS - TOP 3 AT-RISK CLIENTS

1. CLIENT ABC (HIGH RISK - 78%)
   Reasons:
   • Declining margin: 12% (down from 25% last quarter)
   • Payment delays: 2 late payments in last 3 months
   • Support escalations: 5 critical tickets
   • Contract renewal: 45 days away
   • Sentiment: Negative (from recent communications)
   
   Retention Strategy:
   → Schedule executive business review within 7 days
   → Offer 10% discount for annual prepayment
   → Assign dedicated account manager
   → Implement proactive monitoring
   Expected Impact: Reduce churn risk to 35%

2. STARTUPXYZ (MEDIUM RISK - 62%)
   Reasons:
   • Budget constraints: Startup funding concerns
   • Usage declining: -15% over last 2 months
   • Feature requests: Asking for cheaper alternatives
   • Contract: Month-to-month (no commitment)
   
   Retention Strategy:
   → Offer startup-friendly pricing tier
   → Provide ROI analysis showing value delivered
   → Flexible payment terms (quarterly vs monthly)
   → Add value-added services at no cost
   Expected Impact: Reduce churn risk to 30%

3. LEGACY CORP (MEDIUM RISK - 55%)
   Reasons:
   • Cost overruns: Exceeding budget by 20%
   • Scope creep: Unplanned work increasing costs
   • Margin erosion: 18% (down from 28%)
   • Competitor contact: Received competitive proposal
   
   Retention Strategy:
   → Renegotiate contract with clear scope boundaries
   → Implement change order process
   → Right-size service delivery team
   → Lock in 2-year contract with better pricing
   Expected Impact: Reduce churn risk to 25%

OVERALL RECOMMENDATION: Prioritize Client ABC for immediate intervention. Schedule retention meetings for all three within next 14 days.
```

### Test Query 4: Contract Optimization
**Type in chat:**
```
Recommend contract optimizations for Client ABC to improve profitability
```

**Expected Response:**
```
CONTRACT OPTIMIZATION RECOMMENDATIONS - CLIENT ABC

CURRENT CONTRACT ANALYSIS:
• Contract Type: Fixed monthly fee ($8,500/mo)
• Services: Unlimited support, all-inclusive
• Payment Terms: Net 60 (causing cash flow issues)
• Contract Length: Month-to-month
• Annual Value: $102,000
• Current Margin: 12% (BELOW TARGET)

IDENTIFIED ISSUES:
1. Scope Creep: Providing services beyond contract scope
2. Inefficient Pricing: Fixed fee doesn't account for actual usage
3. Poor Payment Terms: 60-day terms hurting cash flow
4. No Commitment: Month-to-month creates instability

OPTIMIZATION RECOMMENDATIONS:

1. PRICING MODEL CHANGE (Impact: +$2,500/mo)
   Current: $8,500/mo unlimited
   Proposed: $7,500 base + $50/hour for additional work
   Rationale: Covers scope creep, aligns cost with value
   
2. PAYMENT TERMS (Impact: +$500/mo cash flow)
   Current: Net 60
   Proposed: Net 30 with 2% discount for Net 15
   Rationale: Improves cash flow, incentivizes early payment

3. CONTRACT COMMITMENT (Impact: +$1,000/mo)
   Current: Month-to-month
   Proposed: 2-year contract with 5% discount
   Rationale: Locks in revenue, reduces churn risk, justifies discount

4. SERVICE TIER ADJUSTMENT (Impact: +$1,500/mo)
   Current: All-inclusive unlimited
   Proposed: Tiered services with clear boundaries
   • Tier 1: Core services ($7,500)
   • Tier 2: Add managed security ($2,000)
   • Tier 3: Add backup/DR ($1,500)
   Rationale: Upsell opportunities, clear scope

5. RESOURCE OPTIMIZATION (Impact: -$2,000/mo cost)
   Current: Over-allocated senior resources
   Proposed: Right-size team with junior/senior mix
   Rationale: Reduces labor costs while maintaining quality

PROJECTED IMPACT:
• New Monthly Revenue: $12,500 (+47%)
• New Monthly Cost: $9,000 (-15%)
• New Margin: 28% (+16 percentage points)
• Annual Revenue Increase: $48,000
• Churn Risk Reduction: 78% → 25%

IMPLEMENTATION PLAN:
Week 1: Schedule contract review meeting with client
Week 2: Present new pricing model with ROI analysis
Week 3: Negotiate and finalize new contract terms
Week 4: Implement new service delivery model

RISK MITIGATION:
• Offer transition period with hybrid pricing
• Provide detailed value analysis showing ROI
• Include performance guarantees in new contract
• Assign dedicated account manager for smooth transition

RECOMMENDATION: Proceed with contract renegotiation immediately. This client is salvageable with proper contract structure.
```

---

## 🔑 Test Scenario 2: Software License Agent

### Dashboard: Software License Intelligence
**URL:** `http://localhost:3000/dashboard/software-license`

### Test Query 1: License Overview
**Type in chat:**
```
Show me an overview of our software license portfolio
```


**Expected Response:**
```
SOFTWARE LICENSE PORTFOLIO OVERVIEW

PORTFOLIO SUMMARY:
• Total Licenses: 30 products across 6 vendors
• Total Monthly Cost: $45,800
• Total Annual Cost: $549,600
• Average Utilization: 68% (BELOW 80% TARGET)
• Compliance Score: 94% (GOOD)

UTILIZATION BREAKDOWN:
• Fully Utilized (>90%): 8 licenses - $18,200/mo
• Well Utilized (70-90%): 12 licenses - $15,600/mo
• Underutilized (50-70%): 6 licenses - $8,000/mo
• Poorly Utilized (<50%): 4 licenses - $4,000/mo

TOP VENDORS BY SPEND:
1. Microsoft - $15,600/mo (34%)
2. Adobe - $8,400/mo (18%)
3. Salesforce - $7,200/mo (16%)
4. Slack - $4,800/mo (10%)
5. Zoom - $3,600/mo (8%)
6. Atlassian - $6,200/mo (14%)

COST OPTIMIZATION OPPORTUNITIES:
• Potential Monthly Savings: $8,500 (19% reduction)
• Underutilized Licenses to Reclaim: 15 seats
• Licenses to Downgrade: 3 products
• Licenses to Consolidate: 2 vendor overlaps

COMPLIANCE RISKS:
• Over-allocated: 2 licenses (immediate action needed)
• Expiring Soon: 5 licenses (within 90 days)
• Audit Risk: LOW

RECOMMENDATION: Focus on reclaiming underutilized licenses and renegotiating top 3 vendor contracts for immediate savings.
```

### Test Query 2: Cost Optimization
**Type in chat:**
```
What are the biggest cost optimization opportunities?
```

**Expected Response:**
```
TOP LICENSE COST OPTIMIZATION OPPORTUNITIES

OPPORTUNITY 1: MICROSOFT 365 RECLAMATION
Current State:
• Total Licenses: 150 Business Premium seats
• Used Licenses: 105 (70% utilization)
• Cost per License: $22/month
• Total Monthly Cost: $3,300

Optimization:
• Reclaim 30 unused seats
• Downgrade 15 light users to Business Basic ($6/mo)
• Keep 105 Premium for active users

Savings:
• Reclaimed seats: 30 × $22 = $660/mo
• Downgraded seats: 15 × $16 = $240/mo
• Total Monthly Savings: $900
• Annual Savings: $10,800

Implementation: 2 weeks (audit usage, notify users, reclaim)

OPPORTUNITY 2: ADOBE CREATIVE CLOUD CONSOLIDATION
Current State:
• Total Licenses: 25 All Apps licenses
• Used Licenses: 12 (48% utilization)
• Cost per License: $55/month
• Total Monthly Cost: $1,375

Optimization:
• Reclaim 8 completely unused licenses
• Downgrade 5 to Single App (Photoshop only) at $21/mo
• Keep 12 All Apps for power users

Savings:
• Reclaimed licenses: 8 × $55 = $440/mo
• Downgraded licenses: 5 × $34 = $170/mo
• Total Monthly Savings: $610
• Annual Savings: $7,320

Implementation: 1 week (usage audit, license reassignment)

OPPORTUNITY 3: SLACK TIER OPTIMIZATION
Current State:
• Plan: Business+ at $12.50/user/month
• Total Users: 200
• Active Users: 180 (90% utilization - GOOD)
• Monthly Cost: $2,500

Optimization:
• Downgrade to Pro plan at $7.25/user/month
• Business+ features (SAML SSO, compliance) not being used
• Keep same user count

Savings:
• Per user savings: $5.25/month
• Total Monthly Savings: $1,050
• Annual Savings: $12,600

Implementation: 1 month (review features, test Pro plan, migrate)

OPPORTUNITY 4: ZOOM CONSOLIDATION
Current State:
• 15 Pro licenses at $15/mo = $225/mo
• 5 Business licenses at $20/mo = $100/mo
• Total: $325/mo
• Usage: Only 12 users active

Optimization:
• Consolidate to 12 Pro licenses
• Implement license sharing for occasional users
• Cancel 8 unused licenses

Savings:
• Canceled licenses: 8 × $15 = $120/mo
• Total Monthly Savings: $120
• Annual Savings: $1,440

Implementation: 2 weeks (usage analysis, license pooling)

OPPORTUNITY 5: ATLASSIAN JIRA/CONFLUENCE OPTIMIZATION
Current State:
• Jira: 100 users at $7/user = $700/mo
• Confluence: 100 users at $5/user = $500/mo
• Total: $1,200/mo
• Active users: 65 in Jira, 50 in Confluence

Optimization:
• Reclaim 35 Jira licenses
• Reclaim 50 Confluence licenses
• Implement just-in-time provisioning

Savings:
• Jira savings: 35 × $7 = $245/mo
• Confluence savings: 50 × $5 = $250/mo
• Total Monthly Savings: $495
• Annual Savings: $5,940

Implementation: 3 weeks (audit, notify, reclaim, automate)

TOTAL OPTIMIZATION IMPACT:
• Total Monthly Savings: $3,175
• Total Annual Savings: $38,100
• Percentage Reduction: 7% of total license spend
• Implementation Timeline: 1-3 months
• Effort: Medium (requires coordination with IT and users)

PRIORITIZED ACTION PLAN:
Week 1-2: Adobe reclamation (quick win, $610/mo)
Week 3-4: Microsoft optimization (high impact, $900/mo)
Week 5-8: Slack downgrade (requires testing, $1,050/mo)
Week 9-10: Zoom consolidation (easy, $120/mo)
Week 11-13: Atlassian optimization (complex, $495/mo)

RISK MITIGATION:
• Communicate changes 2 weeks in advance
• Provide alternative solutions for affected users
• Implement gradual rollout with pilot groups
• Monitor user satisfaction and productivity
• Have rollback plan for each optimization

RECOMMENDATION: Start with Adobe and Microsoft optimizations for quick wins totaling $1,510/mo in savings.
```


### Test Query 3: Compliance Check
**Type in chat:**
```
Are there any compliance risks I should be aware of?
```

**Expected Response:**
```
LICENSE COMPLIANCE RISK ASSESSMENT

OVERALL COMPLIANCE SCORE: 94% (GOOD)

CRITICAL RISKS (Immediate Action Required):

1. MICROSOFT OFFICE 365 - OVER-ALLOCATED ⚠️
   Risk Level: HIGH
   Issue: Using 152 licenses but only purchased 150
   Exposure: $44/month unauthorized usage
   Audit Risk: License true-up penalty of $500-$1,000
   
   Action Required:
   → Purchase 2 additional licenses immediately ($44/mo)
   → OR reclaim 2 licenses from inactive users
   → Timeline: Within 7 days
   → Estimated Cost: $44/mo or $0 if reclaimed

2. ADOBE CREATIVE CLOUD - OVER-ALLOCATED ⚠️
   Risk Level: HIGH  
   Issue: 27 active installations, 25 licenses purchased
   Exposure: $110/month unauthorized usage
   Audit Risk: Adobe audit could result in back-payment + penalties
   
   Action Required:
   → Purchase 2 additional licenses ($110/mo)
   → OR deactivate 2 installations immediately
   → Timeline: Within 7 days
   → Estimated Cost: $110/mo or $0 if deactivated

MEDIUM RISKS (Action Within 30 Days):

3. SALESFORCE - EXPIRING SOON
   Risk Level: MEDIUM
   Issue: Contract expires in 45 days
   Exposure: Service interruption, price increase
   Current Cost: $7,200/mo
   
   Action Required:
   → Start renewal negotiations now
   → Request multi-year discount (10-15%)
   → Review user count and tier requirements
   → Timeline: Negotiate within 30 days
   → Potential Savings: $720-$1,080/mo

4. SLACK - EXPIRING SOON
   Risk Level: MEDIUM
   Issue: Contract expires in 60 days
   Exposure: Auto-renewal at higher rate
   Current Cost: $2,500/mo
   
   Action Required:
   → Evaluate downgrade to Pro plan
   → Negotiate renewal pricing
   → Consider alternative (Microsoft Teams included in M365)
   → Timeline: Decide within 30 days
   → Potential Savings: $1,050/mo

5. ZOOM - PAYMENT METHOD EXPIRING
   Risk Level: MEDIUM
   Issue: Credit card on file expires in 15 days
   Exposure: Service interruption
   
   Action Required:
   → Update payment method
   → Timeline: Within 15 days

LOW RISKS (Monitor):

6. ATLASSIAN - USAGE TRACKING
   Risk Level: LOW
   Issue: No automated usage tracking
   Exposure: Potential waste from unused licenses
   
   Action Required:
   → Implement usage monitoring
   → Quarterly license audits
   → Timeline: Within 90 days

7. MULTIPLE VENDORS - AUTO-RENEWAL CLAUSES
   Risk Level: LOW
   Issue: 8 contracts have auto-renewal with 60-90 day notice
   Exposure: Missed opportunity to renegotiate or cancel
   
   Action Required:
   → Set calendar reminders for 120 days before renewal
   → Review usage 90 days before renewal
   → Timeline: Ongoing

COMPLIANCE BEST PRACTICES:

✅ Implemented:
• Centralized license management system
• Monthly usage reports
• Quarterly compliance audits
• Vendor contract tracking

❌ Missing:
• Automated over-allocation alerts
• Just-in-time license provisioning
• Automated deprovisioning for terminated employees
• License optimization dashboard

AUDIT READINESS:
• Documentation: 90% complete
• License agreements: All on file
• Usage tracking: 85% coverage
• Compliance policies: Documented

IMMEDIATE ACTION ITEMS:
1. Purchase or reclaim Microsoft licenses (7 days)
2. Purchase or deactivate Adobe licenses (7 days)
3. Update Zoom payment method (15 days)
4. Start Salesforce renewal negotiations (30 days)
5. Evaluate Slack renewal options (30 days)

ESTIMATED COST TO ACHIEVE 100% COMPLIANCE:
• Option 1 (Purchase): $154/mo additional cost
• Option 2 (Reclaim): $0 (reclaim from inactive users)

RECOMMENDATION: Reclaim unused licenses from Microsoft and Adobe to achieve compliance at zero cost. Implement automated compliance monitoring to prevent future issues.
```

---

## 🎯 Test Scenario 3: Sales Pipeline Agent

### Dashboard: Sales Pipeline Optimization
**URL:** `http://localhost:3000/dashboard/sales-pipeline`

### Test Query 1: Pipeline Overview
**Type in chat:**
```
Give me an overview of my sales pipeline
```


**Expected Response:**
```
SALES PIPELINE OVERVIEW

PIPELINE HEALTH: STRONG 💪

KEY METRICS:
• Total Pipeline Value: $2,450,000
• Weighted Pipeline: $1,225,000 (50% avg probability)
• Active Opportunities: 25
• Average Deal Size: $98,000
• Sales Cycle Length: 45 days (GOOD)
• Win Rate: 32% (Above 25% target)

PIPELINE BY STAGE:
1. Prospecting: 5 deals - $350K (14%)
2. Qualification: 6 deals - $520K (21%)
3. Proposal: 8 deals - $780K (32%)
4. Negotiation: 4 deals - $600K (24%)
5. Closed Won: 2 deals - $200K (8%)

PIPELINE COVERAGE:
• Monthly Quota: $400K
• Pipeline Coverage Ratio: 6.1x (EXCELLENT)
• Target: 3-5x quota
• Status: Well above target ✅

VELOCITY METRICS:
• Average Days in Prospecting: 7 days
• Average Days in Qualification: 12 days
• Average Days in Proposal: 15 days
• Average Days in Negotiation: 11 days
• Total Average Cycle: 45 days

CONVERSION RATES:
• Prospecting → Qualification: 75%
• Qualification → Proposal: 65%
• Proposal → Negotiation: 50%
• Negotiation → Closed Won: 80%
• Overall Win Rate: 32%

TOP OPPORTUNITIES:
1. Acme Corp - $145K, 85% probability, Negotiation
2. Global Tech - $120K, 75% probability, Proposal
3. Enterprise Solutions - $98K, 70% probability, Proposal
4. TechStart Inc - $85K, 65% probability, Qualification
5. Innovation Labs - $75K, 60% probability, Proposal

AT-RISK DEALS (Stalled >14 days):
• MegaCorp - $180K, stuck in Proposal for 21 days
• Digital Ventures - $95K, stuck in Negotiation for 18 days

FORECAST:
• This Month: $520K (130% of quota) - HIGH CONFIDENCE
• Next Month: $680K (170% of quota) - MEDIUM CONFIDENCE
• This Quarter: $1,850K (154% of quota) - STRONG

RECOMMENDATIONS:
1. Focus on closing Acme Corp and Global Tech (high probability)
2. Unstick MegaCorp and Digital Ventures (high value)
3. Move Qualification stage deals to Proposal (good conversion rate)
4. Maintain current momentum - pipeline is healthy

OVERALL ASSESSMENT: Your pipeline is in excellent shape with strong coverage and healthy conversion rates. Focus on closing high-probability deals and unsticking stalled opportunities.
```

### Test Query 2: Deal Prioritization
**Type in chat:**
```
Which deals should I focus on this week?
```

**Expected Response:**
```
TOP 5 PRIORITY DEALS THIS WEEK

🔥 PRIORITY 1: ACME CORP - $145,000
Stage: Negotiation (85% probability)
Why Priority: Highest value + highest probability = $123K weighted
Last Activity: 3 days ago (proposal sent)
Decision Maker: Sarah Johnson, CTO (engaged)
Timeline: Expects decision by Friday

RECOMMENDED ACTIONS:
→ Call Sarah today to address any concerns
→ Offer 5% discount for contract signed this week
→ Send case study from similar company
→ Schedule final decision call for Thursday
→ Prepare contract for immediate signature

Expected Outcome: 90% chance of close this week
Revenue Impact: $145K

---

🔥 PRIORITY 2: GLOBAL TECH - $120,000
Stage: Proposal (75% probability)
Why Priority: High value, ready to move to negotiation
Last Activity: 5 days ago (demo completed)
Decision Maker: Mike Chen, VP Operations (very interested)
Timeline: Evaluating 2 vendors, decision in 10 days

RECOMMENDED ACTIONS:
→ Follow up on proposal sent last week
→ Address pricing questions from demo
→ Provide ROI calculator showing 18-month payback
→ Offer pilot program to reduce risk
→ Request commitment to move to negotiation stage

Expected Outcome: 80% chance to advance to negotiation
Revenue Impact: $120K

---

🔥 PRIORITY 3: MEGACORP - $180,000 (UNSTICK)
Stage: Proposal (60% probability)
Why Priority: Highest value deal, but STALLED for 21 days
Last Activity: 21 days ago (proposal sent, no response)
Decision Maker: Jennifer Martinez, CFO (went dark)
Timeline: Unknown (RED FLAG)

RECOMMENDED ACTIONS:
→ URGENT: Call Jennifer today to understand status
→ If no answer, escalate to CEO connection
→ Offer to revise proposal based on new information
→ Suggest executive business review meeting
→ Set hard deadline: "Need decision by end of month"

Expected Outcome: 50% chance to revive, 50% chance lost
Revenue Impact: $180K at risk

---

🎯 PRIORITY 4: ENTERPRISE SOLUTIONS - $98,000
Stage: Proposal (70% probability)
Why Priority: Good size, high probability, moving fast
Last Activity: 2 days ago (technical questions answered)
Decision Maker: David Park, IT Director (champion)
Timeline: Wants to start next month

RECOMMENDED ACTIONS:
→ Send updated proposal with technical specs
→ Provide implementation timeline
→ Offer onboarding support package
→ Request meeting with CFO for budget approval
→ Prepare contract for quick close

Expected Outcome: 85% chance of close within 2 weeks
Revenue Impact: $98K

---

🎯 PRIORITY 5: DIGITAL VENTURES - $95,000 (UNSTICK)
Stage: Negotiation (55% probability)
Why Priority: In negotiation but stalled for 18 days
Last Activity: 18 days ago (pricing negotiation)y.
```

iateledate imm die - escalrpt MegaColeon't tunities. Doppor high-value ergress on othmaking prohile  this week we Corpg Acminy on clos heavil: FocusNDATION
RECOMMEtick)
ures (unsDigital Vent - • 10%vance)
ons (adprise Soluti - Enterce)
• 15%vanTech (adl - Globa• 15% (unstick)
gaCorp 0% - Mes week)
• 2close thip (cme Cor:
• 40% - ACATION

TIME ALLO3Kt: $145K-$24venue Impac
• Total Reuck: 1-2st• Deals Un 2-3
Advanced:)
• Deals -$243K2 ($145KClosed: 1-s alLTS:
• DeESUWEEKLY R
EXPECTED next week
n nd plaess aek's progr• Review weget)
 (tarcme Corpe A• ClosFriday:
tion

OI presentaTech - Rl ll
• Globa casioninal decicme Corp - f:
• AThursdayosal

ropal ptudy and finnd case srp - see Coeting
• Acm CFO me4) -s (Priority  Solutionterpriseay:
• Endnesdicing

We- resolve priority 5) Pres (nturital Vel Dig
• Calegotiationmove to niority 2) - ch (Probal Te Glllow upay:
• Foeal

Tuesdck stalled dti unsority 3) -p (PriegaCore
• Call Mday clos Fri - push for 1)(Priorityp cme Corall AMonday:
• CTEGY:

FOCUS STRAEKLY 
WE--

-5-95K
 Impact: $6Revenueted terms
ith adjusose wce to cl: 60% chanmected Outcopeek

Exhis wemmitment tnt for cocour 10% dis
→ Offeivity)t product (losof delay Show cost  at $65K
→ter packageller starma→ Provide s
ual) vs annarterlynt terms (quexible payme Offer fltraints
→onsand budget cundersta to Lis
→ Call ONS: ACTIOMMENDEDing

REC pendt approvaludgeTimeline: Bnsitive)
ice sen, COO (prLisa Thompsoion Maker: 
Decis
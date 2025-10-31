# Update EC2 Data Simulator

## Steps to Update the Data Simulator on EC2

### 1. Connect to EC2
```bash
ssh -i prism-key.pem ubuntu@18.218.83.240
```

### 2. Navigate to the simulator directory
```bash
cd data-simulator
```

### 3. Backup the current file
```bash
cp data_generator.py data_generator.py.backup
```

### 4. Update the data_generator.py file
```bash
nano data_generator.py
```

Find the `update_data_realtime` method (around line 185) and replace it with the improved version:

```python
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
```

Save and exit (Ctrl+X, then Y, then Enter)

### 5. Restart the simulator service
```bash
# If running with systemd
sudo systemctl restart data-simulator

# OR if running with screen/tmux, kill and restart
pkill -f "python main.py"
nohup python main.py > simulator.log 2>&1 &
```

### 6. Verify it's running
```bash
curl http://localhost:8000/health
```

### 7. Regenerate data with realistic values
```bash
curl -X POST http://localhost:8000/api/regenerate
```

### 8. Sync to DynamoDB
```bash
curl -X POST http://localhost:8000/api/sync
```

## What Changed?

### Before (Unrealistic):
- ±15% revenue fluctuations
- 30-60% of data updated each cycle
- Too frequent status changes (30%)
- Large random swings in values

### After (Realistic):
- ±2-5% revenue fluctuations
- Only 5-15% of data updated each cycle
- Rare status changes (5%)
- Small, gradual changes
- Costs stay proportional to revenue (60-80%)

## Verify the Changes

1. Check the dashboard at: https://prism-insights-ten.vercel.app/dashboard
2. Data should now show:
   - Realistic profit margins (20-40%)
   - Fewer negative values
   - Gradual changes over time
   - More stable metrics

## Troubleshooting

If data still looks unrealistic:
1. Check the simulator logs: `tail -f simulator.log`
2. Verify the update was applied: `grep "realistic" data_generator.py`
3. Regenerate data again: `curl -X POST http://localhost:8000/api/regenerate`

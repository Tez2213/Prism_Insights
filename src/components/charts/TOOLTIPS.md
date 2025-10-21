# Chart Tooltips Documentation

## Overview

All chart components now include rich, custom tooltips that provide detailed information on hover with appropriate number formatting.

## Features

### Automatic Number Formatting

The tooltip system automatically detects data types and formats them appropriately:

- **Currency**: Values with keys containing "revenue", "cost", "price", "value", "spend", "budget", "profit", "amount", "salary", "payment"
  - Format: `$1,234,567`
  
- **Percentage**: Values with keys containing "percentage", "rate", "utilization", "compliance", or "score" (when ≤100)
  - Format: `85.5%`
  
- **Hours**: Values with keys containing "hours"
  - Format: `40.5 hrs`
  
- **Count**: Values with keys containing "count" or "number"
  - Format: `1,234`
  
- **Default**: Other numeric values
  - Format: `1,234.56` (with decimals if needed)

### Chart-Specific Tooltips

#### LineChart & AreaChart
- Shows all data series values for the hovered point
- Displays the x-axis label (e.g., month, date)
- Color-coded indicators for each series
- Formatted values based on data key names

#### BarChart
- Shows all bar values for the hovered group
- Displays total when bars are stacked
- Color-coded indicators for each bar
- Formatted values based on data key names

#### PieChart
- Shows the segment name
- Displays the raw value (formatted)
- Shows the percentage of the total
- Appears on hover over any pie segment

#### Heatmap
- Shows the row and column labels
- Displays the cell value (formatted)
- Appears on hover over any cell
- Positioned above the hovered cell

## Usage Examples

### LineChart with Tooltips
```tsx
<LineChart
  data={profitabilityData}
  dataKeys={['revenue', 'cost', 'profit']}
  xAxisKey="month"
  height={300}
/>
```
Tooltip will show:
- Month name
- Revenue: $50,000
- Cost: $30,000
- Profit: $20,000

### BarChart with Tooltips
```tsx
<BarChart
  data={utilizationData}
  dataKeys={['utilizationRate']}
  xAxisKey="name"
  height={300}
/>
```
Tooltip will show:
- Name
- Utilization Rate: 85.5%

### PieChart with Tooltips
```tsx
<PieChart
  data={distributionData}
  height={300}
/>
```
Tooltip will show:
- Segment name
- Value: 1,234
- Percentage: 25.5%

### Heatmap with Tooltips
```tsx
<Heatmap
  data={heatmapData}
  xLabels={weekLabels}
  dataKey="utilizationRate"
  height={300}
/>
```
Tooltip will show:
- Row name (e.g., technician name)
- Period (e.g., Week 1)
- Value: 85.5%

## Customization

### Custom Formatting

If you need custom formatting for specific data keys, you can modify the `formatValue` function in `lib/chart-utils.ts`:

```typescript
export function formatValue(key: string, value: number): string {
  const lowerKey = key.toLowerCase();
  
  // Add your custom formatting logic here
  if (lowerKey.includes('yourkey')) {
    return `Custom: ${value}`;
  }
  
  // ... existing logic
}
```

### Custom Tooltip Components

You can also create custom tooltip components by following the pattern in `custom-tooltips.tsx`:

```tsx
export function CustomMyTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-popover border border-border rounded-md shadow-lg p-3">
      {/* Your custom tooltip content */}
    </div>
  );
}
```

Then use it in your chart:

```tsx
<LineChart
  data={data}
  dataKeys={keys}
  xAxisKey="x"
  customTooltip={<CustomMyTooltip />}
/>
```

## Styling

Tooltips use the following Tailwind/Shadcn classes for consistent styling:
- `bg-popover`: Background color
- `border-border`: Border color
- `text-popover-foreground`: Text color
- `text-muted-foreground`: Secondary text color

These automatically adapt to light/dark mode.

## Performance

- Tooltips are rendered on-demand (only when hovering)
- Formatting functions are optimized for performance
- No unnecessary re-renders

## Accessibility

- Tooltips provide additional context for screen readers
- Color-coded indicators help distinguish data series
- Clear labels and formatted values improve readability

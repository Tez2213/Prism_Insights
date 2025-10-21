# Chart Components

Reusable chart components built with Recharts for the Prism Insights platform.

## Components

### LineChart

Display trends over time with multiple data series.

```tsx
import { LineChart } from "@/components/charts";

<LineChart
  data={[
    { month: "Jan", revenue: 4000, expenses: 2400 },
    { month: "Feb", revenue: 3000, expenses: 1398 },
  ]}
  dataKeys={["revenue", "expenses"]}
  xAxisKey="month"
  title="Revenue vs Expenses"
  height={300}
  yAxisLabel="Amount ($)"
/>
```

### BarChart

Compare values across categories with support for stacked or grouped bars.

```tsx
import { BarChart } from "@/components/charts";

<BarChart
  data={[
    { name: "Product A", sales: 4000, profit: 2400 },
    { name: "Product B", sales: 3000, profit: 1398 },
  ]}
  dataKeys={["sales", "profit"]}
  xAxisKey="name"
  title="Sales by Product"
  stacked={true}
  height={300}
/>
```

### PieChart

Show proportional data distribution.

```tsx
import { PieChart } from "@/components/charts";

<PieChart
  data={[
    { name: "Category A", value: 400 },
    { name: "Category B", value: 300 },
    { name: "Category C", value: 200 },
  ]}
  title="Distribution by Category"
  height={300}
  showLegend={true}
/>
```

### AreaChart

Display cumulative trends with support for stacked areas.

```tsx
import { AreaChart } from "@/components/charts";

<AreaChart
  data={[
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
  ]}
  dataKeys={["desktop", "mobile"]}
  xAxisKey="month"
  title="Traffic by Device"
  stacked={true}
  height={300}
/>
```

### Heatmap

Visualize data intensity across two dimensions.

```tsx
import { Heatmap } from "@/components/charts";

<Heatmap
  data={[
    { name: "Tech A", values: [85, 92, 78, 88, 95] },
    { name: "Tech B", values: [72, 85, 90, 82, 88] },
  ]}
  xLabels={["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]}
  title="Utilization by Technician"
  height={300}
/>
```

## Features

- **Responsive**: All charts automatically resize to fit their container
- **Interactive**: Hover tooltips show detailed data
- **Themed**: Uses CSS variables for consistent theming with light/dark mode support
- **Accessible**: Proper labels and ARIA attributes
- **Customizable**: Colors, heights, and labels can be customized

## Color Scheme

Charts use the following CSS variables defined in `globals.css`:
- `--chart-1` through `--chart-5` for data series colors
- Automatically adapts to light and dark themes

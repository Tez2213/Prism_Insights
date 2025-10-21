"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CustomLineTooltip } from "./custom-tooltips";

interface LineChartProps {
  data: Array<{ [key: string]: any }>;
  dataKeys: string[];
  xAxisKey: string;
  title?: string;
  height?: number;
  colors?: string[];
  yAxisLabel?: string;
  xAxisLabel?: string;
}

const DEFAULT_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function LineChart({
  data,
  dataKeys,
  xAxisKey,
  title,
  height = 300,
  colors = DEFAULT_COLORS,
  yAxisLabel,
  xAxisLabel,
}: LineChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey={xAxisKey}
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
          />
          <Tooltip content={<CustomLineTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="line"
          />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ fill: colors[index % colors.length], r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

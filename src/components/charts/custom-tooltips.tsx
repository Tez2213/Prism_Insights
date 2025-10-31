"use client";

import { formatValue, formatLabel } from "@/lib/chart-utils";

/**
 * Custom tooltip for Line and Area charts
 */
export function CustomLineTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-popover border border-border rounded-md shadow-lg p-3 min-w-[200px]">
      <p className="font-semibold text-sm mb-2 text-popover-foreground border-b border-border pb-1">
        {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">
                {formatLabel(entry.name || entry.dataKey)}:
              </span>
            </div>
            <span className="text-xs font-medium text-popover-foreground">
              {formatValue(entry.dataKey, entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Custom tooltip for Bar charts
 */
export function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  // Calculate total if stacked
  const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
  const isStacked = payload.length > 1;

  return (
    <div className="bg-popover border border-border rounded-md shadow-lg p-3 min-w-[200px]">
      <p className="font-semibold text-sm mb-2 text-popover-foreground border-b border-border pb-1">
        {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">
                {formatLabel(entry.name || entry.dataKey)}:
              </span>
            </div>
            <span className="text-xs font-medium text-popover-foreground">
              {formatValue(entry.dataKey, entry.value)}
            </span>
          </div>
        ))}
        {isStacked && (
          <div className="flex items-center justify-between gap-4 pt-1 mt-1 border-t border-border">
            <span className="text-xs font-semibold text-popover-foreground">
              Total:
            </span>
            <span className="text-xs font-semibold text-popover-foreground">
              {formatValue(payload[0].dataKey, total)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Custom tooltip for Pie charts
 */
export function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0];
  const percentage = data.payload.percent ? (data.payload.percent * 100).toFixed(1) : 0;

  return (
    <div className="bg-popover border border-border rounded-md shadow-lg p-3 min-w-[180px]">
      <p className="font-semibold text-sm mb-2 text-popover-foreground border-b border-border pb-1">
        {data.name}
      </p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">Value:</span>
          <span className="text-xs font-medium text-popover-foreground">
            {formatValue('value', data.value)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">Percentage:</span>
          <span className="text-xs font-medium text-popover-foreground">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Custom tooltip for Heatmap
 */
interface HeatmapTooltipProps {
  rowName: string;
  colLabel: string;
  value: number;
  dataKey?: string;
}

export function HeatmapTooltip({ rowName, colLabel, value, dataKey = 'value' }: HeatmapTooltipProps) {
  return (
    <div className="bg-popover border border-border rounded-md shadow-lg p-3 min-w-[180px]">
      <p className="font-semibold text-sm mb-2 text-popover-foreground border-b border-border pb-1">
        {rowName}
      </p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">Period:</span>
          <span className="text-xs font-medium text-popover-foreground">
            {colLabel}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">Value:</span>
          <span className="text-xs font-medium text-popover-foreground">
            {formatValue(dataKey, value)}
          </span>
        </div>
      </div>
    </div>
  );
}
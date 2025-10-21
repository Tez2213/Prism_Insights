"use client";

import { useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import { HeatmapTooltip } from "./custom-tooltips";

interface HeatmapProps {
  data: Array<{ name: string; values: number[] }>;
  xLabels: string[];
  title?: string;
  height?: number;
  colorScale?: string[];
  dataKey?: string;
}

const DEFAULT_COLOR_SCALE = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#84cc16", // lime-500
  "#22c55e", // green-500
];

export function Heatmap({
  data,
  xLabels,
  title,
  height = 300,
  colorScale = DEFAULT_COLOR_SCALE,
  dataKey = "value",
}: HeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    rowName: string;
    colLabel: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate min and max values for color scaling
  const allValues = data.flatMap((row) => row.values);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Function to get color based on value
  const getColor = (value: number) => {
    if (maxValue === minValue) return colorScale[Math.floor(colorScale.length / 2)];
    
    const normalized = (value - minValue) / (maxValue - minValue);
    const index = Math.floor(normalized * (colorScale.length - 1));
    return colorScale[index];
  };

  const cellWidth = 100 / xLabels.length;
  const cellHeight = height / data.length;

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: "600px" }}>
          {/* X-axis labels */}
          <div className="flex mb-1">
            <div style={{ width: "120px" }} className="flex-shrink-0" />
            {xLabels.map((label, index) => (
              <div
                key={index}
                style={{ width: `${cellWidth}%` }}
                className="text-xs text-center text-muted-foreground"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {data.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center mb-1">
              {/* Y-axis label */}
              <div
                style={{ width: "120px" }}
                className="text-xs text-right pr-2 text-muted-foreground flex-shrink-0"
              >
                {row.name}
              </div>

              {/* Cells */}
              {row.values.map((value, colIndex) => (
                <div
                  key={colIndex}
                  style={{
                    width: `${cellWidth}%`,
                    height: `${cellHeight}px`,
                    backgroundColor: getColor(value),
                    opacity: isAnimated ? 1 : 0,
                    transform: isAnimated ? 'scale(1)' : 'scale(0.8)',
                    transition: `all 0.5s ease-out ${(rowIndex * xLabels.length + colIndex) * 20}ms`,
                  }}
                  className="border border-background flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:opacity-80 relative"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredCell({
                      rowName: row.name,
                      colLabel: xLabels[colIndex],
                      value,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {value.toFixed(0)}
                </div>
              ))}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-center mt-4 gap-2">
            <span className="text-xs text-muted-foreground">Low</span>
            <div className="flex gap-1">
              {colorScale.map((color, index) => (
                <div
                  key={index}
                  style={{ backgroundColor: color }}
                  className="w-8 h-4 rounded"
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y - 10}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <HeatmapTooltip
            rowName={hoveredCell.rowName}
            colLabel={hoveredCell.colLabel}
            value={hoveredCell.value}
            dataKey={dataKey}
          />
        </div>
      )}
    </div>
  );
}

"use client"

import * as React from "react"
import { TableHead } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableHeaderWithTooltipProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  tooltip?: string
  sortable?: boolean
  className?: string
}

export function TableHeaderWithTooltip({
  children,
  tooltip,
  sortable = false,
  className,
  ...props
}: TableHeaderWithTooltipProps) {
  if (!tooltip && !sortable) {
    return (
      <TableHead className={className} {...props}>
        {children}
      </TableHead>
    )
  }

  return (
    <TableHead className={className} {...props}>
      <TooltipProvider delayDuration={200}>
        <div className="flex items-center gap-1.5">
          <span>{children}</span>
          {sortable && (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-50" />
          )}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </TableHead>
  )
}

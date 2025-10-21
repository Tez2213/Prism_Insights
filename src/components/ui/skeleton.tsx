import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

// Skeleton variant for metric cards
function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

// Skeleton variant for tables
function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Table header */}
      <div className="flex gap-4 pb-3 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Skeleton variant for charts
function SkeletonChart({ height = "h-[300px]" }: { height?: string }) {
  // Fixed heights to avoid hydration mismatch
  const barHeights = ['75%', '60%', '85%', '50%', '70%', '90%', '65%', '80%'];
  
  return (
    <div className={cn("rounded-lg border bg-card p-6", height)}>
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="flex items-end justify-between h-[calc(100%-2rem)] gap-2">
        {barHeights.map((height, i) => (
          <Skeleton
            key={`bar-${i}`}
            className="flex-1"
            style={{ height }}
          />
        ))}
      </div>
    </div>
  )
}

// Skeleton variant for text blocks
function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={`line-${i}`}
          className="h-4"
          style={{ width: i === lines - 1 ? "70%" : "100%" }}
        />
      ))}
    </div>
  )
}

// Skeleton variant for dashboard page
function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      
      {/* Table */}
      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <SkeletonTable rows={8} columns={6} />
      </div>
    </div>
  )
}

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonChart, 
  SkeletonText,
  SkeletonDashboard 
}

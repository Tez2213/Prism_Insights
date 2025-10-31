'use client';

import { useState, cloneElement, isValidElement } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize2 } from 'lucide-react';

interface ZoomableChartProps {
  title: string;
  children: React.ReactNode;
}

export function ZoomableChart({ title, children }: ZoomableChartProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Clone the chart with increased height for zoomed view
  const zoomedChart = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        height: 600,
        className: 'w-full',
      })
    : children;

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-8 w-8 hover:bg-gray-100"
          onClick={() => setIsZoomed(true)}
          title="Expand chart"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        {children}
      </div>

      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="w-[95vw] h-[95vh] max-w-none max-h-none p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          </DialogHeader>
          <div className="h-[88vh] w-full overflow-auto">
            {zoomedChart}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

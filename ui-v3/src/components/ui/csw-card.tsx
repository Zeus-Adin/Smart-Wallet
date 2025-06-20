
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CSWCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CSWCard = React.forwardRef<HTMLDivElement, CSWCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "bg-slate-800/50 border-slate-700 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

CSWCard.displayName = "CSWCard";

export default CSWCard;

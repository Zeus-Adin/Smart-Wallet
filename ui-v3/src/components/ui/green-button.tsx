
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GreenButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const GreenButton = React.forwardRef<HTMLButtonElement, GreenButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "bg-green-600 hover:bg-green-700 text-white",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GreenButton.displayName = "GreenButton";

export default GreenButton;

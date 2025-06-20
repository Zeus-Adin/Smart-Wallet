
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RedButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const RedButton = React.forwardRef<HTMLButtonElement, RedButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn(
          "border-red-600 text-red-400 hover:bg-red-200 hover:text-red-800",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

RedButton.displayName = "RedButton";

export default RedButton;

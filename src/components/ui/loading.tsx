import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 24, className, ...props }) => {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <Loader2
        className="animate-spin"
        size={size}
      />
    </div>
  );
}; 
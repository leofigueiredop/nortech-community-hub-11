
import React from 'react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

type StatusType = 'idle' | 'checking' | 'success' | 'error';

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          label: 'Active',
          icon: CheckCircle,
          className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        };
      case 'checking':
        return {
          label: 'Verifying...',
          icon: Clock,
          className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        };
      case 'error':
        return {
          label: 'Setup Required',
          icon: AlertCircle,
          className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        };
      default:
        return {
          label: 'Not Connected',
          icon: AlertCircle,
          className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
        };
    }
  };

  const { label, icon: Icon, className } = getStatusConfig();

  return (
    <Badge variant="secondary" className={cn("gap-1 py-1 px-2", className)}>
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </Badge>
  );
};

export default StatusBadge;

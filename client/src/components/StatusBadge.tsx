
import { ClaimStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: ClaimStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          iconClassName: 'text-status-pending',
        };
      case 'approved':
        return {
          label: 'Approved',
          icon: CheckCircle,
          className: 'bg-green-50 text-green-700 border-green-200',
          iconClassName: 'text-status-approved',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: XCircle,
          className: 'bg-red-50 text-red-700 border-red-200',
          iconClassName: 'text-status-rejected',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      <Icon className={cn('h-3 w-3 mr-1', config.iconClassName)} />
      {config.label}
    </div>
  );
}

export default StatusBadge;

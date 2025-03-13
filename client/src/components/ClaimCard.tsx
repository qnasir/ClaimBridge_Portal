
import { formatDistanceToNow } from 'date-fns';
import { Claim } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { FileText, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ClaimCardProps {
  claim: Claim;
  onClick?: () => void;
  className?: string;
}

export function ClaimCard({ claim, onClick, className }: ClaimCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-200 hover:shadow-md',
        onClick && 'cursor-pointer hover:scale-[1.01]',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="font-medium text-lg leading-none">
              {claim.description.length > 40 
                ? `${claim.description.substring(0, 40)}...` 
                : claim.description}
            </h3>
            <p className="text-muted-foreground text-sm">
              {claim.patientName}
            </p>
          </div>
          <StatusBadge status={claim.status} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatCurrency(claim.amount)}
              {claim.status === 'approved' && claim.approvedAmount !== undefined && (
                <span className="text-status-approved ml-1">
                  ({formatCurrency(claim.approvedAmount)} approved)
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{getTimeAgo(claim.submissionDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{claim.documents.length} document{claim.documents.length !== 1 ? 's' : ''}</span>
          </div>
          {claim.comments && (
            <div className="flex items-center gap-2 col-span-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{claim.comments}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ClaimCard;

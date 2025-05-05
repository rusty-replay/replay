'use client';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuCheckboxItemProps,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { EventStatusType } from '@/api/event/types';
import { useMutationEventStatus } from '@/api/event/use-mutation-event-status';
import { toast } from '@workspace/ui/components/sonner';

type Checked = DropdownMenuCheckboxItemProps['checked'];

interface Props {
  status: EventStatusType | null;
  projectId: number | undefined;
  eventId: number;
}

const StatusIcon = ({ status }: { status: EventStatusType | null }) => {
  switch (status) {
    case 'RESOLVED':
      return <CheckCircle className="h-4 w-4" />;
    case 'UNRESOLVED':
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

export function EventStatusDropdown({ status, projectId, eventId }: Props) {
  const [statusResolved, setStatusResolved] = useState<Checked>(
    status === 'RESOLVED'
  );
  const [statusUnresolved, setStatusUnresolved] = useState<Checked>(
    status === 'UNRESOLVED'
  );

  const { mutateAsync: mutateStatus, isPending: isMutatingStatus } =
    useMutationEventStatus({ projectId: projectId! });

  const handleStatusChange = async (status: EventStatusType) => {
    await mutateStatus(
      { status, eventIds: [eventId] },
      {
        onSuccess: () => {
          setStatusResolved(status === 'RESOLVED');
          setStatusUnresolved(status === 'UNRESOLVED');
          toast.success('Status updated successfully!');
        },
        onError: (error) => {
          console.error('Error updating status:', error);
          toast.error('Failed to update status.');
        },
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className="flex items-center gap-1 cursor-pointer"
        >
          <StatusIcon status={status} />
          {status === 'RESOLVED' && 'Resolved'}
          {status === 'UNRESOLVED' && 'Unresolved'}
          <ChevronDown />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Set Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={statusResolved}
          onCheckedChange={() => handleStatusChange('RESOLVED')}
          className="flex items-center gap-2"
        >
          <Badge variant={'secondary'}>
            <CheckCircle className="h-4 w-4" />
            Resolved
          </Badge>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={statusUnresolved}
          onCheckedChange={() => handleStatusChange('UNRESOLVED')}
          className="flex items-center gap-2"
        >
          <Badge variant={'secondary'}>
            <XCircle className="h-4 w-4" />
            Unresolved
          </Badge>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

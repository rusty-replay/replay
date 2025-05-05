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
import {
  SignalHigh,
  SignalMedium,
  SignalLow,
  ArrowDown,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { EventPriorityType } from '@/api/event/types';
import { useMutationEventPriority } from '@/api/event/use-mutation-event-priority';
import { toast } from '@workspace/ui/components/sonner';

type Checked = DropdownMenuCheckboxItemProps['checked'];

interface Props {
  priority: EventPriorityType | null;
  projectId: number | undefined;
  eventId: number;
}

const PriorityIcon = ({ priority }: { priority: EventPriorityType | null }) => {
  switch (priority) {
    case 'HIGH':
      return <SignalHigh className="h-4 w-4" />;
    case 'MED':
      return <SignalMedium className="h-4 w-4" />;
    case 'LOW':
      return <SignalLow className="h-4 w-4" />;
    default:
      return null;
  }
};

export function PriorityDropdown({ priority, projectId, eventId }: Props) {
  const [priorityHigh, setPriorityHigh] = useState<Checked>(
    priority === 'HIGH'
  );
  const [priorityMed, setPriorityMed] = useState<Checked>(priority === 'MED');
  const [priorityLow, setPriorityLow] = useState<Checked>(priority === 'LOW');

  const { mutateAsync: mutatePriority, isPending: isMutatingPriority } =
    useMutationEventPriority({ projectId: projectId!, eventId });

  const handlePriorityChange = async (priority: EventPriorityType) => {
    await mutatePriority(
      { priority, eventIds: [eventId] },
      {
        onSuccess: () => {
          setPriorityHigh(priority === 'HIGH');
          setPriorityMed(priority === 'MED');
          setPriorityLow(priority === 'LOW');
          toast.success('Priority updated successfully!');
        },
        onError: (error) => {
          console.error('Error updating priority:', error);
          toast.error('Failed to update priority.');
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
          <PriorityIcon priority={priority} />
          {priority === 'HIGH' && 'High'}
          {priority === 'MED' && 'Med'}
          {priority === 'LOW' && 'Low'}
          <ChevronDown />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Set Priority</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={priorityHigh}
          onCheckedChange={() => handlePriorityChange('HIGH')}
          className="flex items-center gap-2"
        >
          <Badge variant={'secondary'}>
            <SignalHigh className="h-4 w-4" />
            High
          </Badge>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={priorityMed}
          onCheckedChange={() => handlePriorityChange('MED')}
          className="flex items-center gap-2"
        >
          <Badge variant={'secondary'}>
            <SignalMedium className="h-4 w-4" />
            Med
          </Badge>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={priorityLow}
          onCheckedChange={() => handlePriorityChange('LOW')}
          className="flex items-center gap-2"
        >
          <Badge variant={'secondary'}>
            <SignalLow className="h-4 w-4" />
            Low
          </Badge>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

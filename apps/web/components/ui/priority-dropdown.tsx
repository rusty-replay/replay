'use client';
import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuCheckboxItemProps,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { SignalHigh, SignalMedium, SignalLow } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';

type Checked = DropdownMenuCheckboxItemProps['checked'];

export function PriorityDropdownMenuCheckboxes() {
  const [priorityHigh, setPriorityHigh] = useState<Checked>(false);
  const [priorityMed, setPriorityMed] = useState<Checked>(false);
  const [priorityLow, setPriorityLow] = useState<Checked>(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Set Priority</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={priorityHigh}
          onCheckedChange={setPriorityHigh}
          className="flex items-center gap-2"
        >
          <Badge variant={'secondary'}>
            <SignalHigh className="h-4 w-4" />
            High
          </Badge>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={priorityMed}
          onCheckedChange={setPriorityMed}
          className="flex items-center gap-2"
        >
          <Badge variant={'secondary'}>
            <SignalMedium className="h-4 w-4" />
            Med
          </Badge>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={priorityLow}
          onCheckedChange={setPriorityLow}
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

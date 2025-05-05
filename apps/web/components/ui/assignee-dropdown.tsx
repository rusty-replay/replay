import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuCheckboxItemProps,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@workspace/ui/components/dropdown-menu';
import { ChevronDown, Search, Plus, UserCircle } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { toast } from '@workspace/ui/components/sonner';
import { useMutationEventAssignee } from '@/api/event/use-mutation-event-assignee';
import { ProjectMemberResponse } from '@/api/project/types';
import { Input } from '@workspace/ui/components/input';
import { getAvatarColor, getInitials } from '@/utils/avatar';

type Checked = DropdownMenuCheckboxItemProps['checked'];

interface Props {
  projectId: number | undefined;
  eventId: number;
  userList: ProjectMemberResponse[] | undefined;
  currentAssigneeId: number | null;
}

export function AssigneeDropdown({
  projectId,
  eventId,
  userList,
  currentAssigneeId,
}: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { mutateAsync: mutateAssign, isPending: isMutatingAssign } =
    useMutationEventAssignee({
      projectId: projectId!,
      eventId,
    });

  const selectedUser = userList?.find(
    (user) => user.userId === currentAssigneeId
  );

  const filteredUsers = userList?.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssigneeChange = async (userId: number) => {
    try {
      const isCurrentlySelected = currentAssigneeId === userId;
      const newAssigneeId = isCurrentlySelected ? null : userId;

      await mutateAssign(
        { assignedTo: newAssigneeId, eventIds: [eventId] },
        {
          onSuccess: () => {
            toast.success(
              isCurrentlySelected
                ? '담당자가 해제되었습니다!'
                : '담당자가 지정되었습니다!'
            );
          },
          onError: (error) => {
            console.error('Error updating assignee:', error);
            toast.error('담당자 변경에 실패했습니다.');
          },
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className="flex items-center gap-1 cursor-pointer"
        >
          {selectedUser ? (
            <>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${getAvatarColor(selectedUser.username)}`}
              >
                {getInitials(selectedUser.username)}
              </div>
              {selectedUser.username}
            </>
          ) : (
            <>
              <UserCircle className="h-4 w-4" />
              담당자
            </>
          )}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuLabel className="font-bold text-lg">
          담당자
        </DropdownMenuLabel>

        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="사용자 또는 팀 검색..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">
          멤버
        </DropdownMenuLabel>

        {filteredUsers?.map((user) => (
          <DropdownMenuCheckboxItem
            key={user.userId}
            checked={currentAssigneeId === user.userId}
            onCheckedChange={() => handleAssigneeChange(user.userId)}
            className="flex items-center gap-2 py-2"
            disabled={isMutatingAssign}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${getAvatarColor(user.username)}`}
            >
              {getInitials(user.username)}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{user.username}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">
          팀
        </DropdownMenuLabel>

        <DropdownMenuCheckboxItem
          checked={false}
          onCheckedChange={() => {}}
          className="flex items-center gap-2 py-2"
          disabled={true}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-pink-500 text-white text-sm">
            R
          </div>
          <span className="font-medium">#reable</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2 py-2">
          <Plus className="h-4 w-4" />
          <span>멤버 초대</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

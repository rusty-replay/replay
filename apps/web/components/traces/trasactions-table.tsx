import { TransactionResponse } from '@/api/traces/types';
import { useQueryTransactions } from '@/api/traces/use-query-transactions';
import { formatDuration } from '@/utils/date';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import dayjs from 'dayjs';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const PAGE_SIZE = 20;
export default function TransactionsTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQueryTransactions({
    page,
    size: PAGE_SIZE,
  });

  const transactions = data?.content || [];
  const totalPages = data ? Math.ceil(data.totalElements / data.size) : 0;

  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>트랜잭션</CardTitle>
          <CardDescription>에러가 발생했습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            {error?.message || '데이터를 불러오는 중 오류가 발생했습니다.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>트랜잭션</CardTitle>
        <CardDescription>
          시스템에서 처리된 모든 트랜잭션 목록입니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingTable />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Transaction Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Env</TableHead>
                <TableHead>Tag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    데이터가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {data ? (
            <>
              전체 {data.totalPages}개 중 {(page - 1) * PAGE_SIZE + 1}-
              {Math.min(page * PAGE_SIZE, data.totalPages)}개 표시
            </>
          ) : (
            '로딩 중...'
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(1)}
            disabled={page === 1 || isLoading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {page} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages || totalPages === 0 || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(totalPages)}
            disabled={page === totalPages || totalPages === 0 || isLoading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function TransactionRow({ transaction }: { transaction: TransactionResponse }) {
  const router = useRouter();

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell
        onClick={() =>
          router.push(
            `/traces/${transaction.projectId}/trace/${transaction.traceId}`
          )
        }
        className="font-mono font-semibold text-xs cursor-pointer text-blue-600 hover:text-blue-800"
      >
        {transaction.traceId}
      </TableCell>
      <TableCell>{transaction.name}</TableCell>
      <TableCell className="flex items-center">
        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
        {formatDuration(transaction.durationMs)}
      </TableCell>
      <TableCell>
        {dayjs(transaction.createdAt).format('YYYY-MM-DD HH:mm:ss')}
      </TableCell>
      <TableCell>
        <Badge
          variant={
            transaction.environment === 'production' ? 'default' : 'outline'
          }
        >
          {transaction.environment}
        </Badge>
      </TableCell>
      <TableCell>
        {transaction.tags ? (
          <div className="flex flex-wrap gap-1">
            {transaction.tags.split(',').map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
    </TableRow>
  );
}

function LoadingTable() {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-full" />
      </div>
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
    </div>
  );
}

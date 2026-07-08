'use client'
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const ApprovedAwardsTableSkeleton: React.FC = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-5 w-12" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-16" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-20" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-20" />
            </TableHead>
            <TableHead className="admin-table-actions-head">
              <Skeleton className="mx-auto h-5 w-16" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow 
              key={index}
              className={
                index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'
              }
            >
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell className="admin-table-actions-cell">
                <div className="admin-table-actions-inner">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4 flex justify-center items-center">
        <PaginationPrevious href="#" />
        <span className="mx-2">
          <Skeleton className="h-5 w-20 inline-block" />
        </span>
        <PaginationNext href="#" />
      </Pagination>
    </div>
  );
};

export default ApprovedAwardsTableSkeleton;

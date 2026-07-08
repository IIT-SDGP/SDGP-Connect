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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const PendingProjectsTableSkeleton: React.FC = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox disabled />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-16" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-16" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-28" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-16" />
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
                <Checkbox disabled />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-44" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <div className="w-20 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Skeleton className="h-4 w-16" />
                </div>
              </TableCell>
              <TableCell className="admin-table-actions-cell">
                <div className="admin-table-actions-inner">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationPrevious href="#"  />
        <span className="mx-2">
          <Skeleton className="h-5 w-32 inline-block" />
        </span>
        <PaginationNext href="#"  />
      </Pagination>
    </div>
  );
};

export default PendingProjectsTableSkeleton;

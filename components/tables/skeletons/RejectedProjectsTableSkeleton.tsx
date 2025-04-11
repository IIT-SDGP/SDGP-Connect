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
import { Pagination, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const RejectedProjectsTableSkeleton: React.FC = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
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
            <TableHead>
              <Skeleton className="h-5 w-24" />
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
              <TableCell>
                <div className="flex gap-2">
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

export default RejectedProjectsTableSkeleton;

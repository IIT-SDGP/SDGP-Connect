'use client';

import { ApprovalStatus } from '@/types/prisma-types';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { AwardStatusBadge } from '@/components/student/status-badges';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AwardFilter = 'all' | 'pending' | 'approved' | 'rejected';

type StudentAwardRow = {
  id: string;
  name: string;
  image: string | null;
  approval_status: ApprovalStatus;
  rejected_reason: string | null;
  createdAt: string;
  project: {
    project_id: string;
    title: string;
  };
  competition: {
    id: string;
    name: string;
  };
};

export default function StudentAwardsClient() {
  const [filter, setFilter] = useState<AwardFilter>('all');
  const [awards, setAwards] = useState<StudentAwardRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAwards = useCallback(async (status: AwardFilter) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
      });

      if (status !== 'all') {
        params.set('status', status);
      }

      const response = await fetch(`/api/student/awards?${params.toString()}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to load awards');
      }

      setAwards(payload.data ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load awards';
      setErrorMessage(message);
      setAwards([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAwards(filter);
  }, [filter, loadAwards]);

  if (isLoading) {
    return (
      <div className='space-y-3'>
        <Skeleton className='h-9 w-80' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <Alert variant='destructive'>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-4'>
      <Tabs value={filter} onValueChange={(value) => setFilter(value as AwardFilter)}>
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='pending'>Pending</TabsTrigger>
          <TabsTrigger value='approved'>Approved</TabsTrigger>
          <TabsTrigger value='rejected'>Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {awards.length === 0 ? (
        <Alert>
          <AlertTitle>No awards yet</AlertTitle>
          <AlertDescription>
            Award submissions linked to your projects will appear here.
          </AlertDescription>
        </Alert>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Award</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Competition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {awards.map((award) => {
              const isEditable = award.approval_status !== ApprovalStatus.APPROVED;

              return (
                <TableRow key={award.id}>
                  <TableCell className='space-y-1'>
                    <div className='font-medium'>{award.name}</div>
                    <div className='text-muted-foreground text-sm'>
                      Submitted {new Date(award.createdAt).toLocaleDateString()}
                    </div>
                    {award.approval_status === ApprovalStatus.REJECTED && award.rejected_reason ? (
                      <div className='text-destructive text-xs'>
                        Reason: {award.rejected_reason}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>{award.project.title}</TableCell>
                  <TableCell>{award.competition.name}</TableCell>
                  <TableCell>
                    <AwardStatusBadge status={award.approval_status} />
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button size='sm' variant='outline' asChild>
                        <Link href={`/project/${award.project.project_id}`}>View</Link>
                      </Button>
                      {isEditable ? (
                        <Button size='sm' variant='outline' asChild>
                          <Link href={`/student/awards/${award.id}/edit`}>Edit</Link>
                        </Button>
                      ) : (
                        <Button size='sm' variant='outline' disabled>
                          Edit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

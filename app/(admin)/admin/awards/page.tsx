// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

// Admin Awards Management Page
'use client';
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PendingAwardsTable from '@/components/tables/PendingAwardsTable';
import ApprovedAwardsTable from '@/components/tables/ApprovedAwardsTable';
import RejectedAwardsTable from '@/components/tables/RejectedAwardsTable';
import PendingAwardsTableSkeleton from '@/components/tables/skeletons/PendingAwardsTableSkeleton';
import ApprovedAwardsTableSkeleton from '@/components/tables/skeletons/ApprovedAwardsTableSkeleton';
import RejectedAwardsTableSkeleton from '@/components/tables/skeletons/RejectedAwardsTableSkeleton';
import { Button } from '@/components/ui/button';
import { RefreshCcw, AlertCircle, FileX2, Inbox } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { useGetAwardsByApprovalStatus } from '@/hooks/awards/useGetAwardsByApprovalStatus';
import { useDebounce } from '@/hooks/use-debounce';
import { AdminPageShell } from '@/components/layout/admin-page-shell';
import { AdminManagementBar } from '@/components/layout/admin-management-bar';
import { AdminSearchField } from '@/components/layout/admin-search-field';

export default function AdminAwardsPage() {
  const [currentTab, setCurrentTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [lastFetchedTime, setLastFetchedTime] = useState('');

  // Hooks for each tab
  const pending = useGetAwardsByApprovalStatus('PENDING', debouncedSearchQuery);
  const approved = useGetAwardsByApprovalStatus('APPROVED', debouncedSearchQuery);
  const rejected = useGetAwardsByApprovalStatus('REJECTED', debouncedSearchQuery);

  useEffect(() => {
    setLastFetchedTime(new Date().toLocaleTimeString());
  }, []);

  const handleTabChange = (value: string) => {
    setCurrentTab(value as any);
    setSearchQuery('');
    if (value === 'pending') pending.refresh();
    if (value === 'approved') approved.refresh();
    if (value === 'rejected') rejected.refresh();
  };

  const handleRefresh = () => {
    if (currentTab === 'pending') pending.refresh();
    if (currentTab === 'approved') approved.refresh();
    if (currentTab === 'rejected') rejected.refresh();
    setLastFetchedTime(new Date().toLocaleTimeString());
  };

  const renderError = (error: any) => {
    if (!error) return null;
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message || error.toString()}</AlertDescription>
      </Alert>
    );
  };

  const renderEmptyState = (type: 'pending' | 'approved' | 'rejected') => {
    const config = {
      pending: {
        title: searchQuery ? 'No Matching Pending Awards' : 'No Pending Awards',
        description: searchQuery
          ? `No pending awards found matching "${searchQuery}"`
          : 'There are no awards waiting for review.',
        icon: searchQuery ? FileX2 : Inbox,
      },
      approved: {
        title: searchQuery ? 'No Matching Approved Awards' : 'No Approved Awards',
        description: searchQuery
          ? `No approved awards found matching "${searchQuery}"`
          : 'No awards have been approved yet.',
        icon: FileX2,
      },
      rejected: {
        title: searchQuery ? 'No Matching Rejected Awards' : 'No Rejected Awards',
        description: searchQuery
          ? `No rejected awards found matching "${searchQuery}"`
          : 'No awards have been rejected.',
        icon: FileX2,
      },
    }[type];
    return (
      <div className="flex justify-center items-center p-8">
        <EmptyState
          title={config.title}
          description={config.description}
          icons={[config.icon]}
        />
      </div>
    );
  };

  const renderContent = () => {
    if (currentTab === 'pending') {
      if (pending.isLoading) return <PendingAwardsTableSkeleton />;
      if (pending.error) return renderError(pending.error);
      if (pending.isEmpty) return renderEmptyState('pending');
      return (
        <PendingAwardsTable
          awards={pending.awards}
          currentPage={pending.currentPage}
          totalPages={pending.totalPages}
          onNextPage={pending.fetchNextPage}
          onPreviousPage={pending.fetchPreviousPage}
          refresh={pending.refresh}
        />
      );
    }
    if (currentTab === 'approved') {
      if (approved.isLoading) return <ApprovedAwardsTableSkeleton />;
      if (approved.error) return renderError(approved.error);
      if (approved.isEmpty) return renderEmptyState('approved');
      return (
        <ApprovedAwardsTable
          awards={approved.awards}
          currentPage={approved.currentPage}
          totalPages={approved.totalPages}
          onNextPage={approved.fetchNextPage}
          onPreviousPage={approved.fetchPreviousPage}
          refresh={approved.refresh}
        />
      );
    }
    if (currentTab === 'rejected') {
      if (rejected.isLoading) return <RejectedAwardsTableSkeleton />;
      if (rejected.error) return renderError(rejected.error);
      if (rejected.isEmpty) return renderEmptyState('rejected');
      return (
        <RejectedAwardsTable
          awards={rejected.awards}
          currentPage={rejected.currentPage}
          totalPages={rejected.totalPages}
          onNextPage={rejected.fetchNextPage}
          onPreviousPage={rejected.fetchPreviousPage}
          refresh={rejected.refresh}
        />
      );
    }
    return null;
  };

  return (
    <AdminPageShell
      title="Awards Management"
      description="Review and manage award submissions."
    >
      <Tabs defaultValue="pending" value={currentTab} onValueChange={handleTabChange} className="w-full">
        <AdminManagementBar
          tabs={
            <TabsList className="admin-tab-list">
              <TabsTrigger value="pending" className="admin-tab-trigger">
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="admin-tab-trigger">
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" className="admin-tab-trigger">
                Rejected
              </TabsTrigger>
            </TabsList>
          }
          center={
            <AdminSearchField
              placeholder="Search awards…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              showClear
              onClear={() => setSearchQuery('')}
              aria-label="Search awards"
            />
          }
          end={
            <Button variant="outline" onClick={handleRefresh} className="h-10">
              Last Fetched: {lastFetchedTime}
              <RefreshCcw className="ml-2 h-4 w-4" />
            </Button>
          }
        />
        <div className="admin-table-wrap">{renderContent()}</div>
      </Tabs>
    </AdminPageShell>
  );
}

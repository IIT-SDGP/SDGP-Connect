// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

'use client';

import ApproveDialog from '@/components/dialogs/ApproveDialog';
import DetailsDialog from '@/components/dialogs/DetailsDialog';
import RejectDialog from '@/components/dialogs/RejectDialog';
import { ApprovedProjectsTable } from '@/components/tables/ApprovedProjectsTable';
import { PendingProjectsTable } from '@/components/tables/PendingProjectsTable';
import { RejectedProjectsTable } from '@/components/tables/RejectedProjectsTable';
import PendingProjectsTableSkeleton from '@/components/tables/skeletons/PendingProjectsTableSkeleton';
import ApprovedProjectsTableSkeleton from '@/components/tables/skeletons/ApprovedProjectsTableSkeleton';
import RejectedProjectsTableSkeleton from '@/components/tables/skeletons/RejectedProjectsTableSkeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetProjectsByApprovalStatus } from '@/hooks/project/useGetProjectsByApprovalStatus';
import { useToggleProjectFeature } from '@/hooks/project/useToggleProjectFeature';
import { ApprovedProject, PendingProject, RejectedProject } from '@/types/project/response';
import { ProjectApprovalStatus } from '@/types/prisma-types';
import { useEffect, useState, useCallback } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertCircle, FileX2, Inbox, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BulkApproveDialog from '@/components/dialogs/BulkApproveDialog';
import DuplicatePendingProjectsDialog from '@/components/dialogs/DuplicatePendingProjectsDialog';
import { useSession } from 'next-auth/react';
import { AdminPageShell } from '@/components/layout/admin-page-shell';
import { AdminManagementBar } from '@/components/layout/admin-management-bar';
import { AdminSearchField } from '@/components/layout/admin-search-field';

export default function ProjectManagement() {
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [bulkApproveDialog, setBulkApproveDialog] = useState(false);
  const [duplicateDialog, setDuplicateDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [lastFetchedTime, setLastFetchedTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [pendingSort, setPendingSort] = useState<{ by: string; dir: 'asc' | 'desc' }>({
    by: 'submissionDate',
    dir: 'desc',
  });
  const [approvedSort, setApprovedSort] = useState<{ by: string; dir: 'asc' | 'desc' }>({
    by: 'approvedAt',
    dir: 'desc',
  });
  const [rejectedSort, setRejectedSort] = useState<{ by: string; dir: 'asc' | 'desc' }>({
    by: 'rejectedAt',
    dir: 'desc',
  });
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    projects: pendingProjects,
    isLoading: isPendingLoading,
    error: pendingError,
    isEmpty: isPendingEmpty,
    refresh: refreshPending,
    currentPage: pendingCurrentPage,
    totalPages: pendingTotalPages,
    fetchNextPage: fetchPendingNextPage,
    fetchPreviousPage: fetchPendingPreviousPage,
  } = useGetProjectsByApprovalStatus<PendingProject>(
    ProjectApprovalStatus.PENDING,
    debouncedSearchQuery,
    10,
    pendingSort.by,
    pendingSort.dir
  );

  const {
    projects: approvedProjects,
    isLoading: isApprovedLoading,
    error: approvedError,
    isEmpty: isApprovedEmpty,
    refresh: refreshApproved,
    currentPage: approvedCurrentPage,
    totalPages: approvedTotalPages,
    fetchNextPage: fetchApprovedNextPage,
    fetchPreviousPage: fetchApprovedPreviousPage,
  } = useGetProjectsByApprovalStatus<ApprovedProject>(
    ProjectApprovalStatus.APPROVED,
    debouncedSearchQuery,
    10,
    approvedSort.by,
    approvedSort.dir
  );

  const {
    projects: rejectedProjects,
    isLoading: isRejectedLoading,
    error: rejectedError,
    isEmpty: isRejectedEmpty,
    refresh: refreshRejected,
    currentPage: rejectedCurrentPage,
    totalPages: rejectedTotalPages,
    fetchNextPage: fetchRejectedNextPage,
    fetchPreviousPage: fetchRejectedPreviousPage,
  } = useGetProjectsByApprovalStatus<RejectedProject>(
    ProjectApprovalStatus.REJECTED,
    debouncedSearchQuery,
    10,
    rejectedSort.by,
    rejectedSort.dir
  );

  // Reset selected projects when changing tabs or search query
  useEffect(() => {
    setSelectedProjects([]);
  }, [currentTab, debouncedSearchQuery]);

  // Initialize lastFetchedTime on client-side only
  useEffect(() => {
    setLastFetchedTime(new Date().toLocaleTimeString());
  }, []);

  const handleSelectProject = (projectId: number) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      }
      return [...prev, projectId];
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(pendingProjects.map(project => project.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const getDefaultSortDir = (column: string): 'asc' | 'desc' => {
    const dateColumns = new Set(['submissionDate', 'approvedAt', 'rejectedAt']);
    return dateColumns.has(column) ? 'desc' : 'asc';
  };

  const toggleSort = (
    current: { by: string; dir: 'asc' | 'desc' },
    column: string
  ): { by: string; dir: 'asc' | 'desc' } => {
    if (current.by === column) {
      return { by: column, dir: current.dir === 'asc' ? 'desc' : 'asc' };
    }
    return { by: column, dir: getDefaultSortDir(column) };
  };

  const handleApprove = (project: PendingProject) => {
    setCurrentProject(project);
    setApproveDialog(true);
  };

  const handleReject = async (project: PendingProject | ApprovedProject) => {
    if ('featured' in project && project.featured) {
      await toggleFeature(project.id, false);
    }

    setCurrentProject(project);
    setRejectDialog(true);
  };

  const handleViewDetails = (project: any) => {
    setCurrentProject(project);
    setDetailsDialog(true);
  };

  const { toggleFeature, isLoading: isFeatureToggling } = useToggleProjectFeature({
    onSuccess: () => refreshApproved()
  });

  const handleToggleFeature = async (project: ApprovedProject, featured: boolean) => {
    await toggleFeature(project.id, featured);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value as 'pending' | 'approved' | 'rejected');
    // Clear search when switching tabs to avoid confusion
    setSearchQuery('');
    setDebouncedSearchQuery('');
    
    if (value === 'pending') refreshPending();
    if (value === 'approved') refreshApproved();
    if (value === 'rejected') refreshRejected();
  };

  const handleRefresh = useCallback(() => {
    if (currentTab === 'pending') refreshPending();
    if (currentTab === 'approved') refreshApproved();
    if (currentTab === 'rejected') refreshRejected();
    setLastFetchedTime(new Date().toLocaleTimeString());
  }, [currentTab, refreshPending, refreshApproved, refreshRejected]);

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  };

  const renderEmptyState = (type: 'pending' | 'approved' | 'rejected') => {
    const config = {
      pending: {
        title: searchQuery ? 'No Matching Pending Projects' : 'No Pending Projects',
        description: searchQuery 
          ? `No pending projects found matching "${searchQuery}"`
          : 'There are no projects waiting for review.',
        icon: searchQuery ? FileX2 : Inbox,
      },
      approved: {
        title: searchQuery ? 'No Matching Approved Projects' : 'No Approved Projects',
        description: searchQuery 
          ? `No approved projects found matching "${searchQuery}"`
          : 'No projects have been approved yet.',
        icon: FileX2,
      },
      rejected: {
        title: searchQuery ? 'No Matching Rejected Projects' : 'No Rejected Projects',
        description: searchQuery 
          ? `No rejected projects found matching "${searchQuery}"`
          : 'No projects have been rejected.',
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
      if (isPendingLoading) return <PendingProjectsTableSkeleton />;
      if (pendingError) return renderError(pendingError);
      if (isPendingEmpty) return renderEmptyState('pending');
      return (
        <PendingProjectsTable
          projects={pendingProjects}
          selectedProjects={selectedProjects}
          onSelectProject={handleSelectProject}
          onSelectAll={handleSelectAll}
          onViewDetails={handleViewDetails}
          onApprove={handleApprove}
          onReject={handleReject}
          sortBy={pendingSort.by}
          sortDir={pendingSort.dir}
          onSortChange={(column) => setPendingSort((prev) => toggleSort(prev, column))}
          currentPage={pendingCurrentPage}
          totalPages={pendingTotalPages}
          onNextPage={fetchPendingNextPage}
          onPreviousPage={fetchPendingPreviousPage}
        />
      );
    }

    if (currentTab === 'approved') {
      if (isApprovedLoading) return <ApprovedProjectsTableSkeleton />;
      if (approvedError) return renderError(approvedError);
      if (isApprovedEmpty) return renderEmptyState('approved');
      return (
        <ApprovedProjectsTable
          projects={approvedProjects}
          onViewDetails={handleViewDetails}
          onToggleFeature={handleToggleFeature}
          onReject={handleReject}
          sortBy={approvedSort.by}
          sortDir={approvedSort.dir}
          onSortChange={(column) => setApprovedSort((prev) => toggleSort(prev, column))}
          currentPage={approvedCurrentPage}
          totalPages={approvedTotalPages}
          onNextPage={fetchApprovedNextPage}
          onPreviousPage={fetchApprovedPreviousPage}
        />
      );
    }

    if (currentTab === 'rejected') {
      if (isRejectedLoading) return <RejectedProjectsTableSkeleton />;
      if (rejectedError) return renderError(rejectedError);
      if (isRejectedEmpty) return renderEmptyState('rejected');
      return (
        <RejectedProjectsTable
          projects={rejectedProjects}
          onViewDetails={handleViewDetails}
          sortBy={rejectedSort.by}
          sortDir={rejectedSort.dir}
          onSortChange={(column) => setRejectedSort((prev) => toggleSort(prev, column))}
          currentPage={rejectedCurrentPage}
          totalPages={rejectedTotalPages}
          onNextPage={fetchRejectedNextPage}
          onPreviousPage={fetchRejectedPreviousPage}
        />
      );
    }
  };

  return (
    <AdminPageShell
      title="Project Management"
      description="Review, approve, and monitor project submissions."
    >
      <Tabs defaultValue="pending" onValueChange={handleTabChange} value={currentTab}>
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
              placeholder="Search projects…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              showClear
              onClear={() => {
                setSearchQuery('');
                setDebouncedSearchQuery('');
              }}
              aria-label="Search projects"
            />
          }
          end={
            <>
              <Button variant="outline" onClick={handleRefresh} className="h-10">
                Last Fetched: {lastFetchedTime}
                <RefreshCcw className="ml-2 h-4 w-4" />
              </Button>
              {currentTab === 'pending' && isAdmin && (
                <Button variant="outline" onClick={() => setDuplicateDialog(true)} className="h-10">
                  Reject Duplicates
                </Button>
              )}
              {currentTab === 'pending' && selectedProjects.length > 0 && (
                <Button onClick={() => setBulkApproveDialog(true)} variant="default" className="h-10">
                  Approve All ({selectedProjects.length})
                </Button>
              )}
            </>
          }
        />

        <div className="admin-table-wrap">{renderContent()}</div>
      </Tabs>

      {detailsDialog && currentProject && (
        <DetailsDialog
          open={detailsDialog}
          onOpenChange={setDetailsDialog}
          projectID={currentProject.id}
          onReject={
            currentTab === 'pending' || currentTab === 'approved'
              ? () => {
                  setDetailsDialog(false);
                  setRejectDialog(true);
                }
              : undefined
          }
          onApprove={
            currentTab === 'pending'
              ? () => {
                  setDetailsDialog(false);
                  setApproveDialog(true);
                }
              : undefined
          }
        />
      )}

      {approveDialog && currentProject && (
        <ApproveDialog
          open={approveDialog}
          onOpenChange={setApproveDialog}
          projectID={currentProject.id}
          onApproved={refreshPending}
        />
      )}

      {rejectDialog && currentProject && (
        <RejectDialog
          open={rejectDialog}
          onOpenChange={setRejectDialog}
          project={currentProject}
          onRejected={() => {
            refreshPending();
            refreshApproved();
          }}
        />
      )}

      {bulkApproveDialog && selectedProjects.length > 0 && (
        <BulkApproveDialog
          open={bulkApproveDialog}
          onOpenChange={setBulkApproveDialog}
          projectIds={selectedProjects}
          onApproved={refreshPending}
        />
      )}

      {duplicateDialog && (
        <DuplicatePendingProjectsDialog
          open={duplicateDialog}
          onOpenChange={setDuplicateDialog}
          onRejected={refreshPending}
        />
      )}
    </AdminPageShell>
  );
}

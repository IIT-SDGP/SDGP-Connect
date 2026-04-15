// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

'use client';

import ApproveDialog from '@/components/dialogs/ApproveDialog';
import DeleteProjectDialog from '@/components/dialogs/DeleteProjectDialog';
import DetailsDialog from '@/components/dialogs/DetailsDialog';
import RejectDialog from '@/components/dialogs/RejectDialog';
import { ApprovedProjectsTable } from '@/components/tables/ApprovedProjectsTable';
import { PendingProjectsTable } from '@/components/tables/PendingProjectsTable';
import { RejectedProjectsTable } from '@/components/tables/RejectedProjectsTable';
import PendingProjectsTableSkeleton from '@/components/tables/skeletons/PendingProjectsTableSkeleton';
import ApprovedProjectsTableSkeleton from '@/components/tables/skeletons/ApprovedProjectsTableSkeleton';
import RejectedProjectsTableSkeleton from '@/components/tables/skeletons/RejectedProjectsTableSkeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeleteProject } from '@/hooks/project/useDeleteProject';
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
import { toast } from 'sonner';

const projectStatuses = ['IDEA', 'RESEARCH', 'MVP', 'DEPLOYED', 'STARTUP'];

export default function ProjectManagement() {
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [bulkApproveDialog, setBulkApproveDialog] = useState(false);
  const [duplicateDialog, setDuplicateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
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

  const { deleteProject, loading: isDeleting } = useDeleteProject({
    onSuccess: () => {
      toast.success('Project deleted successfully');
      refreshRejected();
      setDeleteDialog(false);
      setCurrentProject(null);
    },
    onError: () => {
      toast.error('Failed to delete project');
    },
  });

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

  const handleDelete = (project: RejectedProject) => {
    setCurrentProject(project);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (currentProject?.id) {
      await deleteProject(currentProject.id);
    }
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
          onDelete={handleDelete}
          showDeleteButton={isAdmin}
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Management</h1>
        <p className="text-muted-foreground">Review and manage project submissions</p>
      </div>

      <Tabs defaultValue="pending" onValueChange={handleTabChange} value={currentTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <div className="my-4 flex flex-wrap gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search projects..."
              className="max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setDebouncedSearchQuery('');
                }}
              >
                Clear
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
            >
              Last Fetched: {lastFetchedTime}
              <RefreshCcw />
            </Button>

            {currentTab === 'pending' && isAdmin && (
              <Button
                variant="outline"
                onClick={() => setDuplicateDialog(true)}
              >
                Reject Duplicates
              </Button>
            )}

            {currentTab === 'pending' && selectedProjects.length > 0 && (
              <Button
                onClick={() => setBulkApproveDialog(true)}
                variant="default"
              >
                Approve All ({selectedProjects.length})
              </Button>
            )}
          </div>
        </div>

        {renderContent()}
      </Tabs>

      {detailsDialog && currentProject && (
        <DetailsDialog
          open={detailsDialog}
          onOpenChange={setDetailsDialog}
          projectID={currentProject.id}
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

      {deleteDialog && currentProject && (
        <DeleteProjectDialog
          open={deleteDialog}
          onOpenChange={setDeleteDialog}
          onConfirm={handleConfirmDelete}
          loading={isDeleting}
          projectTitle={currentProject.title}
          groupNumber={currentProject.groupNumber}
        />
      )}
    </div>
  );
}

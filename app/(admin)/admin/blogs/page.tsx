// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

'use client';

import ApproveBlogDialog from '@/components/dialogs/ApproveBlogDialog';
import RejectBlogDialog from '@/components/dialogs/RejectBlogDialog';
import BulkApproveBlogDialog from '@/components/dialogs/BulkApproveBlogDialog';
import BlogDetailsDialog from '@/components/dialogs/BlogDetailsDialog';
import { PendingBlogsTable } from '@/components/tables/PendingBlogsTable';
import { ApprovedBlogsTable } from '@/components/tables/ApprovedBlogsTable';
import { RejectedBlogsTable } from '@/components/tables/RejectedBlogsTable';
import PendingBlogsTableSkeleton from '@/components/tables/skeletons/PendingBlogsTableSkeleton';
import ApprovedBlogsTableSkeleton from '@/components/tables/skeletons/ApprovedBlogsTableSkeleton';
import RejectedBlogsTableSkeleton from '@/components/tables/skeletons/RejectedBlogsTableSkeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetBlogsByStatus } from '@/hooks/blogs/useGetBlogsByStatus';
import { useGetBlogStats } from '@/hooks/blogs/useGetBlogStats';
import { useBlogActions } from '@/hooks/blogs/useBlogActions';
import { AdminBlogPost, PendingBlogPost, ApprovedBlogPost, RejectedBlogPost, BlogStatus } from '@/types/blog/admin';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EmptyPendingBlogs, EmptyApprovedBlogs, EmptyRejectedBlogs, EmptyBlogSearch } from '@/components/Empty-states/blogEmptyStates';
import { AlertCircle, BookOpen, RefreshCcw, Users, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';
import { AdminPageShell } from '@/components/layout/admin-page-shell';
import { AdminManagementBar } from '@/components/layout/admin-management-bar';
import { AdminSearchField } from '@/components/layout/admin-search-field';

export default function BlogManagement() {
  const router = useRouter();
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [bulkApproveDialog, setBulkApproveDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<AdminBlogPost | null>(null);
  const [currentTab, setCurrentTab] = useState<BlogStatus>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch blogs data
  const {
    blogs,
    total,
    page,
    totalPages,
    isLoading: isBlogsLoading,
    error: blogsError,
    refetch: refetchBlogs,
  } = useGetBlogsByStatus({
    status: currentTab,
    page: currentPage,
    limit: 10,
    search: debouncedSearchQuery,
  });

  // Fetch stats
  const {
    stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetBlogStats();

  // Blog actions hook
  const { featureBlog, unfeatureBlog } = useBlogActions({
    onSuccess: () => {
      refetchBlogs();
      refetchStats();
      toast.success('Blog updated successfully!');
    },
  });

  // Reset search and page when tab changes
  useEffect(() => {
    setSearchQuery('');
    setCurrentPage(1);
    setSelectedBlogs([]);
  }, [currentTab]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Handle dialog actions
  const handleApprove = (blog: AdminBlogPost) => {
    setCurrentBlog(blog);
    setApproveDialog(true);
  };

  const handleReject = (blog: AdminBlogPost) => {
    setCurrentBlog(blog);
    setRejectDialog(true);
  };
  const handleViewDetails = (blog: AdminBlogPost) => {
    setCurrentBlog(blog);
    setDetailsDialog(true);
  };

  const handleBulkApprove = () => {
    if (selectedBlogs.length === 0) return;
    setBulkApproveDialog(true);
  };

  const handleToggleFeature = async (blog: ApprovedBlogPost) => {
    try {
      if (blog.featured) {
        await unfeatureBlog(blog.id);
      } else {
        await featureBlog(blog.id);
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleToggleFeatureFromDetails = async (blog: AdminBlogPost) => {
    if (blog.approved) {
      await handleToggleFeature(blog as ApprovedBlogPost);
    }
  };

  // Selection handlers
  const handleSelectBlog = (blogId: string) => {
    setSelectedBlogs(prev =>
      prev.includes(blogId)
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBlogs(blogs.map(blog => blog.id));
    } else {
      setSelectedBlogs([]);
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Success handlers for dialogs
  const handleSuccess = useCallback(() => {
    refetchBlogs();
    refetchStats();
    setSelectedBlogs([]);
  }, [refetchBlogs, refetchStats]);

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Blog Posts',
      value: stats?.total || 0,
      icon: BookOpen,
      isLoading: isStatsLoading,
    },
    {
      title: 'Pending Review',
      value: stats?.pending || 0,
      icon: Clock,
      isLoading: isStatsLoading,
    },
    {
      title: 'Approved',
      value: stats?.approved || 0,
      icon: CheckCircle,
      isLoading: isStatsLoading,
    },
    {
      title: 'Featured',
      value: stats?.featured || 0,
      icon: Star,
      isLoading: isStatsLoading,
    },
  ];

  // Render empty state
  const renderEmptyState = () => {
    if (debouncedSearchQuery) {
      return <EmptyBlogSearch />;
    }

    switch (currentTab) {
      case 'pending':
        return <EmptyPendingBlogs />;
      case 'approved':
        return <EmptyApprovedBlogs />;
      case 'rejected':
        return <EmptyRejectedBlogs />;
      default:
        return <EmptyPendingBlogs />;
    }
  };

  // Render table based on current tab
  const renderTable = () => {
    if (isBlogsLoading) {
      switch (currentTab) {
        case 'pending':
          return <PendingBlogsTableSkeleton />;
        case 'approved':
          return <ApprovedBlogsTableSkeleton />;
        case 'rejected':
          return <RejectedBlogsTableSkeleton />;
        default:
          return <PendingBlogsTableSkeleton />;
      }
    }    if (blogs.length === 0) {
      return (
        <div className="flex justify-center items-center min-h-[400px] p-8">
          {renderEmptyState()}
        </div>
      );
    }

    switch (currentTab) {
      case 'pending':
        return (
          <PendingBlogsTable
            blogs={blogs as PendingBlogPost[]}
            selectedBlogs={selectedBlogs}
            onSelectBlog={handleSelectBlog}
            onSelectAll={handleSelectAll}
            onViewDetails={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        );
      case 'approved':
        return (
          <ApprovedBlogsTable
            blogs={blogs as ApprovedBlogPost[]}
            selectedBlogs={selectedBlogs}
            onSelectBlog={handleSelectBlog}
            onSelectAll={handleSelectAll}
            onViewDetails={handleViewDetails}
            onToggleFeature={handleToggleFeature}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        );
      case 'rejected':
        return (
          <RejectedBlogsTable
            blogs={blogs as RejectedBlogPost[]}
            selectedBlogs={selectedBlogs}
            onSelectBlog={handleSelectBlog}
            onSelectAll={handleSelectAll}
            onViewDetails={handleViewDetails}
            onReapprove={handleApprove}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        );
      default:
        return <PendingBlogsTableSkeleton />;
    }
  };

  return (
    <AdminPageShell
      title="Blog Management"
      description="Manage and moderate blog posts submitted by authors."
      actions={
        <Button variant="outline" onClick={() => { refetchBlogs(); refetchStats(); }}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      }
    >

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="admin-surface rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.isLoading ? '...' : stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(blogsError || statsError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {blogsError || statsError}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as BlogStatus)}>
        <AdminManagementBar
          tabs={
            <TabsList className="admin-tab-list">
              <TabsTrigger value="pending" className="admin-tab-trigger">
                Pending {stats?.pending ? `(${stats.pending})` : ''}
              </TabsTrigger>
              <TabsTrigger value="approved" className="admin-tab-trigger">
                Approved {stats?.approved ? `(${stats.approved})` : ''}
              </TabsTrigger>
              <TabsTrigger value="rejected" className="admin-tab-trigger">
                Rejected {stats?.rejected ? `(${stats.rejected})` : ''}
              </TabsTrigger>
            </TabsList>
          }
          center={
            <AdminSearchField
              placeholder="Search blogs…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              showClear
              onClear={() => setSearchQuery('')}
              aria-label="Search blogs"
            />
          }
          end={
            currentTab === 'pending' && selectedBlogs.length > 0 ? (
              <Button onClick={handleBulkApprove} className="h-10">
                Approve Selected ({selectedBlogs.length})
              </Button>
            ) : null
          }
        />
        <div className="admin-table-wrap min-h-[500px]">{renderTable()}</div>
      </Tabs>

      <ApproveBlogDialog
        open={approveDialog}
        onOpenChange={setApproveDialog}
        blog={currentBlog}
        onApproved={handleSuccess}
      />

      <RejectBlogDialog
        open={rejectDialog}
        onOpenChange={setRejectDialog}
        blog={currentBlog}
        onRejected={handleSuccess}
      />

      <BulkApproveBlogDialog
        open={bulkApproveDialog}
        onOpenChange={setBulkApproveDialog}
        blogIds={selectedBlogs}
        onApproved={handleSuccess}
      />

      <BlogDetailsDialog
        open={detailsDialog}
        onOpenChange={setDetailsDialog}
        blog={currentBlog}
        onApprove={handleApprove}
        onReject={handleReject}
        onToggleFeature={handleToggleFeatureFromDetails}
      />
    </AdminPageShell>
  );
}

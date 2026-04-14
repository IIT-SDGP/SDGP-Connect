'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { BlogStatusBadge, getBlogStatus } from '@/components/student/status-badges';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type BlogFilter = 'all' | 'pending' | 'approved' | 'rejected';

type StudentBlogRow = {
  id: string;
  title: string;
  excerpt: string;
  approved: boolean;
  rejectedById: string | null;
  rejectedReason: string | null;
  createdAt: string;
};

function BlogTitleCell({ blog, status }: { blog: StudentBlogRow; status: ReturnType<typeof getBlogStatus> }) {
  return (
    <div className='space-y-1'>
      <div className='font-medium'>{blog.title}</div>
      <div className='text-muted-foreground max-w-xl text-sm line-clamp-2'>{blog.excerpt}</div>
      {status === 'rejected' && blog.rejectedReason ? (
        <div className='text-destructive text-xs'>Reason: {blog.rejectedReason}</div>
      ) : null}
    </div>
  );
}

function BlogRowActions({
  blog,
  status,
  onDelete,
}: {
  blog: StudentBlogRow;
  status: ReturnType<typeof getBlogStatus>;
  onDelete: () => void;
}) {
  const isEditable = status !== 'approved';

  return (
    <div className='flex justify-end gap-2'>
      {status === 'approved' ? (
        <Button size='sm' variant='outline' asChild>
          <Link href={`/blog/${blog.id}`}>View</Link>
        </Button>
      ) : null}
      {isEditable ? (
        <Button size='sm' variant='outline' asChild>
          <Link href={`/student/blogs/${blog.id}/edit`}>Edit</Link>
        </Button>
      ) : (
        <Button size='sm' variant='outline' disabled>Edit</Button>
      )}
      {isEditable ? (
        <Button size='sm' variant='destructive' onClick={onDelete}>Delete</Button>
      ) : null}
    </div>
  );
}

export default function StudentBlogsClient() {
  const [filter, setFilter] = useState<BlogFilter>('all');
  const [blogs, setBlogs] = useState<StudentBlogRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBlogs = useCallback(async (status: BlogFilter) => {
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

      const response = await fetch(`/api/student/blogs?${params.toString()}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to load blog posts');
      }

      setBlogs(payload.data ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load blog posts';
      setErrorMessage(message);
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBlogs(filter);
  }, [filter, loadBlogs]);

  const handleDelete = async (blogId: string) => {
    if (!window.confirm('Delete this blog post?')) return;

    try {
      const response = await fetch(`/api/student/blogs/${blogId}`, {
        method: 'DELETE',
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to delete blog post');
      }

      toast.success('Blog post deleted');
      await loadBlogs(filter);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete blog post');
    }
  };

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
      <Tabs value={filter} onValueChange={(value) => setFilter(value as BlogFilter)}>
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='pending'>Pending</TabsTrigger>
          <TabsTrigger value='approved'>Approved</TabsTrigger>
          <TabsTrigger value='rejected'>Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {blogs.length === 0 ? (
        <Alert>
          <AlertTitle>No blog posts yet</AlertTitle>
          <AlertDescription>
            Your blog submissions will appear here once you create them.
          </AlertDescription>
        </Alert>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => {
              const status = getBlogStatus(blog);
              return (
                <TableRow key={blog.id}>
                  <TableCell><BlogTitleCell blog={blog} status={status} /></TableCell>
                  <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell><BlogStatusBadge {...blog} /></TableCell>
                  <TableCell className='text-right'>
                    <BlogRowActions
                      blog={blog}
                      status={status}
                      onDelete={() => void handleDelete(blog.id)}
                    />
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

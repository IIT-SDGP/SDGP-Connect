import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RejectedBlogPost } from '@/types/blog/admin';
import { Eye, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RejectedBlogsTableProps {
  blogs: RejectedBlogPost[];
  selectedBlogs: string[];
  onSelectBlog: (blogId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewDetails: (blog: RejectedBlogPost) => void;
  onReapprove: (blog: RejectedBlogPost) => void;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function RejectedBlogsTable({
  blogs,
  selectedBlogs,
  onSelectBlog,
  onSelectAll,
  onViewDetails,
  onReapprove,
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}: RejectedBlogsTableProps) {
  return (
    <div className="admin-table-inner">
      <Table>
        <TableHeader className="admin-table-thead">
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedBlogs.length === blogs.length && blogs.length > 0}
                onCheckedChange={(checked) => onSelectAll(checked as boolean)}
              />
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Author</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rejected By</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reason</TableHead>
            <TableHead className="admin-table-actions-head">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id} className="hover:bg-muted/25">
              <TableCell>
                <Checkbox
                  checked={selectedBlogs.includes(blog.id)}
                  onCheckedChange={() => onSelectBlog(blog.id)}
                />
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate">
                  <span className="font-medium">{blog.title}</span>
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {blog.excerpt}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {blog.author.avatarUrl && (
                    <img
                      src={blog.author.avatarUrl}
                      alt={blog.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium text-sm">{blog.author.name}</div>
                    <div className="text-xs text-muted-foreground">{blog.author.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{blog.category}</Badge>
              </TableCell>
              <TableCell>                <div className="text-sm">
                  <div className="font-medium">{blog.rejectedBy?.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(blog.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="text-sm text-muted-foreground truncate" title={blog.rejectedReason}>
                  {blog.rejectedReason}
                </div>
              </TableCell>
              <TableCell className="admin-table-actions-cell">
                <div className="admin-table-actions-inner">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => onViewDetails(blog)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-green-600 hover:text-green-700"
                    onClick={() => onReapprove(blog)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <div className="flex justify-center border-t border-border/70 px-4 py-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

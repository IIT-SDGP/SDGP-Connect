import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ApprovedBlogPost } from '@/types/blog/admin';
import { Eye, Star, StarOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApprovedBlogsTableProps {
  blogs: ApprovedBlogPost[];
  selectedBlogs: string[];
  onSelectBlog: (blogId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewDetails: (blog: ApprovedBlogPost) => void;
  onToggleFeature: (blog: ApprovedBlogPost) => void;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function ApprovedBlogsTable({
  blogs,
  selectedBlogs,
  onSelectBlog,
  onSelectAll,
  onViewDetails,
  onToggleFeature,
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}: ApprovedBlogsTableProps) {
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
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approved By</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
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
                  {blog.featured && (
                    <Star className="inline h-4 w-4 ml-2 text-yellow-500" />
                  )}
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
                  <div className="font-medium">{blog.approvedBy?.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(blog.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>
                  {blog.featured && (
                    <Badge variant="default">Featured</Badge>
                  )}
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
                    className={blog.featured ? "rounded-lg text-yellow-600 hover:text-yellow-700" : "rounded-lg"}
                    onClick={() => onToggleFeature(blog)}
                  >
                    {blog.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
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

// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminBlogPost } from '@/types/blog/admin';
import { Eye, ExternalLink, User, Calendar, Tag, Star, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface BlogDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog: AdminBlogPost | null;
  onApprove?: (blog: AdminBlogPost) => void;
  onReject?: (blog: AdminBlogPost) => void;
  onToggleFeature?: (blog: AdminBlogPost) => void;
}

const BlogDetailsDialog = ({ 
  open, 
  onOpenChange, 
  blog, 
  onApprove, 
  onReject, 
  onToggleFeature 
}: BlogDetailsDialogProps) => {
  if (!blog) return null;

  const getStatusBadge = () => {
    if (blog.approved && blog.rejectedById === null) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
    } else if (blog.rejectedById !== null) {
      return <Badge variant="destructive">Rejected</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const openInNewTab = () => {
    window.open(`/blog/${blog.id}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold mb-2">{blog.title}</DialogTitle>
              <DialogDescription className="text-base">
                {blog.excerpt}
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={openInNewTab}
              className="ml-4"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Blog Image */}
            {blog.imageUrl && (
              <div className="w-full">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Metadata Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Author Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Author Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {blog.author.avatarUrl && (
                      <img
                        src={blog.author.avatarUrl}
                        alt={blog.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium">{blog.author.name}</div>
                      <div className="text-sm text-muted-foreground">{blog.author.email}</div>
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  {(blog.author.linkedin || blog.author.twitter || blog.author.website) && (
                    <div className="pt-2">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Social Links</div>
                      <div className="flex gap-2 flex-wrap">
                        {blog.author.linkedin && (
                          <Badge variant="outline" className="text-xs">LinkedIn</Badge>
                        )}
                        {blog.author.twitter && (
                          <Badge variant="outline" className="text-xs">Twitter</Badge>
                        )}
                        {blog.author.website && (
                          <Badge variant="outline" className="text-xs">Website</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Blog Metadata */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Blog Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <Badge variant="outline">{blog.category}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <div className="flex items-center gap-2">
                      {getStatusBadge()}
                      {blog.featured && <Badge variant="default"><Star className="h-3 w-3 mr-1" />Featured</Badge>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Submitted:</span>
                    <span className="text-sm">{format(new Date(blog.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Published:</span>
                    <span className="text-sm">{format(new Date(blog.publishedAt), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Approval/Rejection Info */}
            {(blog.approvedBy || blog.rejectedBy) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    {blog.approvedBy ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Approval Information
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2 text-red-600" />
                        Rejection Information
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {blog.approvedBy && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Approved by:</span>
                        <span className="text-sm font-medium">{blog.approvedBy.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm">{format(new Date(blog.updatedAt), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                    </div>
                  )}
                  
                  {blog.rejectedBy && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rejected by:</span>
                        <span className="text-sm font-medium">{blog.rejectedBy.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm">{format(new Date(blog.updatedAt), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                      {blog.rejectedReason && (
                        <div className="mt-3">
                          <div className="text-sm text-muted-foreground mb-1">Reason:</div>
                          <div className="text-sm p-3 bg-red-50 rounded border border-red-200">
                            {blog.rejectedReason}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Blog Content */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Content Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: blog.content.substring(0, 500) + (blog.content.length > 500 ? '...' : '') 
                    }} 
                  />
                </div>
                {blog.content.length > 500 && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Content truncated. Click "Open in New Tab" to view the full blog post.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex-shrink-0 pt-4 border-t">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            
            <div className="flex gap-2">
              {onToggleFeature && blog.approved && (
                <Button
                  variant="outline"
                  onClick={() => onToggleFeature(blog)}
                  className={blog.featured ? "text-yellow-600 hover:text-yellow-700" : ""}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {blog.featured ? 'Remove Featured' : 'Make Featured'}
                </Button>
              )}
              
              {onApprove && !blog.approved && (
                <Button
                  onClick={() => onApprove(blog)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              )}
              
              {onReject && (!blog.approved || blog.rejectedById === null) && (
                <Button
                  variant="destructive"
                  onClick={() => onReject(blog)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDetailsDialog;

// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useBlogActions } from '@/hooks/blogs/useBlogActions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AdminBlogPost } from '@/types/blog/admin';

interface ApproveBlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog: AdminBlogPost | null;
  onApproved: () => void;
}

const ApproveBlogDialog = ({ open, onOpenChange, blog, onApproved }: ApproveBlogDialogProps) => {
  const [featured, setFeatured] = useState(false);
  const [showSuccessState, setShowSuccessState] = useState(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open && blog) {
      setFeatured(blog.featured);
      setShowSuccessState(false);
    }
  }, [open, blog]);

  const { approveBlog, featureBlog, unfeatureBlog, isLoading, error } = useBlogActions({
    onSuccess: () => {
      setShowSuccessState(true);
      toast.success('Blog post approved successfully!');
      
      // Delay closing the dialog to show the success state
      setTimeout(() => {
        onApproved(); // Refresh the list
        onOpenChange(false);
      }, 1500);
    },
  });

  const handleApprove = async () => {
    if (!blog) return;

    try {
      await approveBlog(blog.id);
      
      // Handle featuring separately if needed
      if (featured !== blog.featured) {
        if (featured) {
          await featureBlog(blog.id);
        } else {
          await unfeatureBlog(blog.id);
        }
      }
    } catch (err) {
      toast.error('Failed to approve blog post');
      console.error('Error approving blog:', err);
    }
  };

  if (!blog) return null;

  // Show success state
  if (showSuccessState) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Blog Post Approved!</h3>
            <p className="text-sm text-muted-foreground">
              The blog post has been successfully approved and will now be visible to users.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Approve Blog Post</DialogTitle>
          <DialogDescription>
            Review and approve this blog post for publication.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Blog Details */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-lg">{blog.title}</h4>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>By: {blog.author.name}</span>
              <span>Category: {blog.category}</span>
              <span>Submitted: {format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
            </div>
            <p className="text-sm">{blog.excerpt}</p>
          </div>

          {/* Feature Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">Feature this blog post</h4>
              <p className="text-sm text-muted-foreground">
                Featured posts will be highlighted on the blog homepage
              </p>
            </div>
            <Switch
              checked={featured}
              onCheckedChange={setFeatured}
            />
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Approving...
              </>
            ) : (
              'Approve Blog Post'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveBlogDialog;

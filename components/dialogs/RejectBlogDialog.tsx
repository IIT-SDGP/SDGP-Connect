// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useBlogActions } from '@/hooks/blogs/useBlogActions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AdminBlogPost } from '@/types/blog/admin';

interface RejectBlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog: AdminBlogPost | null;
  onRejected: () => void;
}

const RejectBlogDialog = ({ open, onOpenChange, blog, onRejected }: RejectBlogDialogProps) => {
  const [reason, setReason] = useState('');
  const [showSuccessState, setShowSuccessState] = useState(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setReason('');
      setShowSuccessState(false);
    }
  }, [open]);

  const { rejectBlog, isLoading, error } = useBlogActions({
    onSuccess: () => {
      setShowSuccessState(true);
      toast.success('Blog post rejected successfully!');
      
      // Delay closing the dialog to show the success state
      setTimeout(() => {
        onRejected(); // Refresh the list
        onOpenChange(false);
      }, 1500);
    },
  });

  const handleReject = async () => {
    if (!blog || !reason.trim()) return;

    try {
      await rejectBlog(blog.id, reason.trim());
    } catch (err) {
      toast.error('Failed to reject blog post');
      console.error('Error rejecting blog:', err);
    }
  };

  if (!blog) return null;

  // Show success state
  if (showSuccessState) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <X className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Blog Post Rejected</h3>
            <p className="text-sm text-muted-foreground">
              The blog post has been rejected and the author will be notified.
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
          <DialogTitle>Reject Blog Post</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this blog post. This will help the author understand what needs to be improved.
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

          {/* Rejection Reason */}
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason for rejection *
            </label>
            <Textarea
              id="reason"
              placeholder="Please explain why this blog post is being rejected. Be specific and constructive to help the author improve their submission."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              This message will be sent to the author to help them understand what needs to be improved.
            </p>
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
          <Button 
            onClick={handleReject} 
            disabled={isLoading || !reason.trim()}
            variant="destructive"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Rejecting...
              </>
            ) : (
              'Reject Blog Post'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectBlogDialog;

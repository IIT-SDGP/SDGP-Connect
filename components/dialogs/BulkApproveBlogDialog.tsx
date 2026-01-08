// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useBlogActions } from '@/hooks/blogs/useBlogActions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BulkApproveBlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blogIds: string[];
  onApproved: () => void;
}

const BulkApproveBlogDialog = ({ open, onOpenChange, blogIds, onApproved }: BulkApproveBlogDialogProps) => {
  const [showSuccessState, setShowSuccessState] = useState(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setShowSuccessState(false);
    }
  }, [open]);

  const { approveBlogs, isLoading, error } = useBlogActions({
    onSuccess: () => {
      setShowSuccessState(true);
      toast.success(`${blogIds.length} blog posts approved successfully!`);
      
      // Delay closing the dialog to show the success state
      setTimeout(() => {
        onApproved(); // Refresh the list
        onOpenChange(false);
      }, 1500);
    },
  });

  const handleBulkApprove = async () => {
    try {
      await approveBlogs(blogIds);
    } catch (err) {
      toast.error('Failed to approve blog posts');
      console.error('Error bulk approving blogs:', err);
    }
  };

  // Show success state
  if (showSuccessState) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Blog Posts Approved!</h3>
            <p className="text-sm text-muted-foreground">
              {blogIds.length} blog posts have been successfully approved and are now visible to users.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Approve Blog Posts</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve {blogIds.length} selected blog posts? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Confirmation Message */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              You are about to approve <strong>{blogIds.length}</strong> blog posts. 
              These posts will become publicly visible and accessible to all users.
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
          <Button onClick={handleBulkApprove} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Approving...
              </>
            ) : (
              `Approve ${blogIds.length} Posts`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkApproveBlogDialog;

// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useApproveAndFeatured } from '@/hooks/project/useApproveAndFeatured';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectID: string;
  onApproved: () => void;
}

const ApproveDialog = ({ open, onOpenChange, projectID, onApproved }: ApproveDialogProps) => {
  const [featured, setFeatured] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<any>(null);
  const [showSuccessState, setShowSuccessState] = useState(false);
  

  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setConflictInfo(null);
      setShowSuccessState(false);
    }
  }, [open]);
  
  const { approveProject, isLoading, error } = useApproveAndFeatured({
    onSuccess: () => {

      setShowSuccessState(true);
      
      // Delay closing the dialog to show the success state
      setTimeout(() => {
        onApproved(); // Refresh the list
        if (!conflictInfo) { // Close dialog only if no conflict occurred
          onOpenChange(false);
        }
      }, 1500);
    },
    onAlreadyApproved: (data) => {
      setConflictInfo(data);
    },
    onError: (error) => {
      console.error('Error in approval process:', error);
      // Keep dialog open on errors, but still refresh the list
      onApproved();
    }
  });

  const handleApprove = async () => {
   
    try {
      await approveProject(projectID, featured);
    } catch (err) {
      console.error('Unexpected error in handleApprove:', err);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this project?
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        
        {showSuccessState && !conflictInfo && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">Success</AlertTitle>
            <AlertDescription className="text-green-600">
              The project has been successfully approved
              {featured ? ' and featured' : ''}.
            </AlertDescription>
          </Alert>
        )}
        
        {conflictInfo && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Already Approved</AlertTitle>
            <AlertDescription>
              This project was already approved
              {conflictInfo.approvedAt && ` on ${format(new Date(conflictInfo.approvedAt), 'MMM dd, yyyy HH:mm')}`}
              {conflictInfo.approvedBy && ` by another user (ID: ${conflictInfo.approvedBy})`}.
            </AlertDescription>
          </Alert>
        )}
        
        {!showSuccessState && !conflictInfo && (
          <div className="flex items-center space-x-2">
            <Switch 
              id="featured" 
              checked={featured} 
              onCheckedChange={setFeatured}
              disabled={isLoading || !!conflictInfo}
            />
            <label htmlFor="featured">Feature this project</label>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {conflictInfo || showSuccessState ? 'Close' : 'Cancel'}
          </Button>
          {!conflictInfo && !showSuccessState && (
            <Button onClick={handleApprove} disabled={isLoading}>
              {isLoading ? <LoadingSpinner  /> : null}
              {isLoading ? 'Approving...' : 'Approve'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveDialog;

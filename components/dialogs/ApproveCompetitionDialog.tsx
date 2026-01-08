// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useCompetitionApprovalActions } from '@/hooks/competition/useCompetitionApprovalActions';

interface ApproveCompetitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competitionId: string;
  onApproved?: () => void;
}

export function ApproveCompetitionDialog({ open, onOpenChange, competitionId, onApproved }: ApproveCompetitionDialogProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { acceptCompetition, loading, error, clearState } = useCompetitionApprovalActions({
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onApproved && onApproved();
        onOpenChange(false);
      }, 1500);
    }
  });

  const handleApprove = async () => {
    try {
      await acceptCompetition(competitionId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      clearState();
      setShowSuccess(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Competition</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this competition?
          </DialogDescription>
        </DialogHeader>        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {showSuccess && (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-900">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Competition Approved!</AlertTitle>
          </Alert>
        )}        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={loading}>
            {loading ? 'Approving...' : 'Approve'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteCompetitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  competitionName?: string;
  awardCount?: number;
}

export default function DeleteCompetitionDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  loading, 
  competitionName, 
  awardCount 
}: DeleteCompetitionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Competition?</DialogTitle>
          <DialogDescription>
            {competitionName && (
              <>
                This competition '<b>{competitionName}</b>' will be permanently deleted.
                <br />
                {typeof awardCount === 'number' && awardCount > 0 && (
                  <>
                    <b>{awardCount}</b> award{awardCount !== 1 && 's'} related to this competition will also be deleted.
                    <br />
                  </>
                )}
                <span className="text-destructive font-semibold">This action cannot be undone.</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
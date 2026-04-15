// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  projectTitle?: string;
  groupNumber?: string;
}

export default function DeleteProjectDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
  projectTitle,
  groupNumber,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project?</DialogTitle>
          <DialogDescription>
            {projectTitle && groupNumber ? (
              <>
                You are about to delete <b>&quot;{projectTitle}&quot;</b> (Group {groupNumber}).
                <br /><br />
              </>
            ) : null}
            This will permanently delete:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All project details, slides, and team information</li>
              <li>All associated images from storage</li>
              <li>Any awards linked to this project</li>
            </ul>
            <br />
            <span className="text-destructive font-semibold">This action cannot be undone.</span>
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

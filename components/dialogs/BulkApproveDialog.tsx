// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";
import useBulkApprove from "@/hooks/project/useBulkApprove";

interface BulkApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectIds: number[];
  onApproved?: () => void;
}

export default function BulkApproveDialog({
  open,
  onOpenChange,
  projectIds,
  onApproved,
}: BulkApproveDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { bulkApprove, isLoading } = useBulkApprove({
    onSuccess: () => {
      onOpenChange(false);
      if (onApproved) onApproved();
    },
  });

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await bulkApprove(projectIds);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approve {projectIds.length} Projects</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve all {projectIds.length} selected projects? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner size="sm" /> : "Approve All"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

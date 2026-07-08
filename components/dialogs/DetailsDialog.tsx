// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProjectDetails from "../ProjectDetails";

export type DetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectID: string | number;
  /** Shown centered; typical flow closes details then opens reject dialog */
  onReject?: () => void;
  /** Shown on the right */
  onApprove?: () => void;
};

const DetailsDialog = ({
  open,
  onOpenChange,
  projectID,
  onReject,
  onApprove,
}: DetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="flex h-[92vh] max-h-[92vh] w-[96vw] !max-w-[96vw] flex-col gap-0 rounded-2xl border p-0 shadow-2xl sm:!max-w-[96vw] xl:!max-w-[92vw] 2xl:!max-w-[88vw]">
      <DialogHeader className="border-b px-6 py-4">
        <DialogTitle>Project Details</DialogTitle>
      </DialogHeader>
      <div className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden">
        {projectID != null && <ProjectDetails projectID={String(projectID)} />}
      </div>
      <div
        className="grid grid-cols-3 items-center gap-2 border-t px-4 py-4 sm:gap-3 sm:px-6"
        data-slot="dialog-footer"
      >
        <div className="flex justify-start">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
        <div className="flex justify-center">
          {onReject ? (
            <Button type="button" variant="destructive" onClick={onReject}>
              Reject
            </Button>
          ) : null}
        </div>
        <div className="flex justify-end">
          {onApprove ? (
            <Button type="button" onClick={onApprove}>
              Approve
            </Button>
          ) : null}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default DetailsDialog;

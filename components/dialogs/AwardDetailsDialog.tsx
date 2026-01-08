// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '../ui/scroll-area';
import AwardCard from '../competition/AwardCard';
import { useGetAwardById } from '@/hooks/awards/useGetAwardById';

interface AwardDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  awardId: string | null;
}

const AwardDetailsDialog = ({ open, onOpenChange, awardId }: AwardDetailsDialogProps) => {
  const { award, isLoading } = useGetAwardById(awardId || undefined);

  // Prepare the winner object for AwardCard
  const winner = award && award.project ? {
    id: award.project.project_id || award.project.id || '',
    projectName: award.project.title || 'Untitled',
    team: award.project.group_num || '-',
    sdgpYear: award.project.sdgp_year || '-',
    cover: award.project.cover_image || '/placeholder.svg',
    award: award.name || 'Award',
    description: award.project.subtitle || award.project.description || 'No description provided.'
  } : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-auto !max-w-none md:min-w-[800px] md:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Award Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] flex items-center justify-center">
          {isLoading && <div className="text-center py-10">Loading...</div>}
          {!isLoading && winner && <AwardCard winner={winner} />}
          {!isLoading && !winner && <div className="text-center py-10 text-red-500">Award not found.</div>}
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AwardDetailsDialog;

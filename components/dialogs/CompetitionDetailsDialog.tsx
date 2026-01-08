// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '../ui/scroll-area';
import CompetitionCard from '../competition/CompetitionCard';
import { useGetCompetitionById } from '@/hooks/competition/useGetCompetitionById';

interface CompetitionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competitionId: string | null;
}

const CompetitionDetailsDialog = ({ open, onOpenChange, competitionId }: CompetitionDetailsDialogProps) => {
  const { competition, isLoading } = useGetCompetitionById(competitionId || undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-auto !max-w-none md:min-w-[800px] md:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Competition Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] flex items-center justify-center">
          {isLoading && <div className="text-center py-10">Loading...</div>}
          {!isLoading && competition && (
            <CompetitionCard
              id={competition.id}
              title={competition.name || "Untitled"}
              cover={competition.cover_image || "/placeholder.svg"}
              type={competition.type || "-"}
              startDate={competition.start_date || ""}
              endDate={competition.end_date || ""}
              logo={competition.logo || "/placeholder.svg"}
              viewLink={competition.id ? `/competitions/${competition.id}` : "#"}
              description={competition.description || "No description provided."}
              winnersCount={Array.isArray(competition.awards) ? competition.awards.length : 0}
            />
          )}
          {!isLoading && !competition && (
            <div className="text-center py-10 text-red-500">Competition not found.</div>
          )}
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

export default CompetitionDetailsDialog;

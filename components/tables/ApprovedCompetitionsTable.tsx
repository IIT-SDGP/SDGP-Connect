import React from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Pagination, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import CompetitionDetailsDialog from '../dialogs/CompetitionDetailsDialog';
import { RejectCompetitionDialog } from '../dialogs/RejectCompetitionDialog';

interface Competition {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  type: string;
  cover_image?: string;
  logo?: string;
  accepted_by?: { name: string } | null;
}

interface ApprovedCompetitionsTableProps {
  competitions: Competition[];
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export default function ApprovedCompetitionsTable({ competitions, currentPage, totalPages, onNextPage, onPreviousPage }: ApprovedCompetitionsTableProps) {
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [selectedCompetition, setSelectedCompetition] = React.useState<Competition | null>(null);

  const handleViewDetails = (id: string) => {
    setSelectedId(id);
    setDetailsOpen(true);
  };

  const handleReject = (competition: Competition) => {
    setSelectedCompetition(competition);
    setRejectDialogOpen(true);
  };

  return (
    <div className="admin-table-inner">
      <Table>
        <TableHeader className="admin-table-thead">
          <TableRow>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Start Date</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">End Date</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approved By</TableHead>
            <TableHead className="admin-table-actions-head">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competitions.map((comp) => (
            <TableRow key={comp.id} className="hover:bg-muted/25">
              <TableCell className="font-medium">{comp.name}</TableCell>
              <TableCell>{format(new Date(comp.start_date), "MMM d yyyy")}</TableCell>
              <TableCell>{format(new Date(comp.end_date), "MMM d yyyy")}</TableCell>
              <TableCell>
                <Badge variant="secondary">{comp.type}</Badge>
              </TableCell>
              <TableCell>
                <span title={comp.description} className="truncate block max-w-xs cursor-help">
                  {comp.description.length > 40 ? comp.description.slice(0, 40) + "..." : comp.description}
                </span>
              </TableCell>
            
              <TableCell>{comp.accepted_by ? comp.accepted_by.name : "-"}</TableCell>
              <TableCell className="admin-table-actions-cell">
                <div className="admin-table-actions-inner">
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => handleViewDetails(comp.id)}>
                    View Details
                  </Button>
                  <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => handleReject(comp)}>
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="border-t border-border/70 px-4 py-3 flex justify-center items-center">
        {currentPage > 1 && <PaginationPrevious href="#" onClick={onPreviousPage} />}
        <span className="mx-2 text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
        {currentPage < totalPages && <PaginationNext href="#" onClick={onNextPage} />}      </Pagination>
      <CompetitionDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} competitionId={selectedId} />
      {selectedCompetition && (
        <RejectCompetitionDialog
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          competition={selectedCompetition}
          onRejected={() => setSelectedCompetition(null)}
        />
      )}
    </div>
  );
}

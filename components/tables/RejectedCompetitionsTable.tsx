import React from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import CompetitionDetailsDialog from '../dialogs/CompetitionDetailsDialog';
import DeleteCompetitionDialog from '../dialogs/DeleteCompetitionDialog';
import { useGetCompetitionDeleteCount } from '@/hooks/competition/useGetCompetitionDeleteCount';
import { useDeleteCompetition } from '@/hooks/competition/useDeleteCompetition';
import { toast } from 'sonner';

interface Competition {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  type: string;
  cover_image?: string;
  logo?: string;
  rejected_by?: { name: string } | null;
  rejected_reason?: string;
}

interface RejectedCompetitionsTableProps {
  competitions: Competition[];
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  refresh?: () => void;
}

export default function RejectedCompetitionsTable({ competitions, currentPage, totalPages, onNextPage, onPreviousPage, refresh }: RejectedCompetitionsTableProps) {
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleteName, setDeleteName] = React.useState<string | undefined>(undefined);
  const [deleteAwardCount, setDeleteAwardCount] = React.useState<number | undefined>(undefined);

  const { data: deleteCountData, fetchCount } = useGetCompetitionDeleteCount(deleteId || undefined);
  const { deleteCompetition, loading: deleteLoading } = useDeleteCompetition({
    onSuccess: () => {
      setDeleteDialogOpen(false);
      toast.success('Competition and related awards deleted successfully');
      if (typeof refresh === 'function') refresh();
    },
    onError: () => {
      toast.error('Failed to delete competition');
    },
  });

  React.useEffect(() => {
    if (deleteDialogOpen && deleteId) {
      fetchCount();
    }
  }, [deleteDialogOpen, deleteId, fetchCount]);

  React.useEffect(() => {
    if (deleteCountData) {
      setDeleteName(deleteCountData.name);
      setDeleteAwardCount(deleteCountData.awardCount);
    }
  }, [deleteCountData]);

  const handleViewDetails = (id: string) => {
    setSelectedId(id);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteCompetition(deleteId);
    }
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
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rejected By</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reason</TableHead>
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
              <TableCell>{comp.rejected_by ? comp.rejected_by.name : "-"}</TableCell>
              <TableCell className="max-w-xs truncate">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-default">{comp.rejected_reason || "-"}</span>
                  </TooltipTrigger>
                  <TooltipContent>{comp.rejected_reason || "No reason provided"}</TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="admin-table-actions-cell">
                <div className="admin-table-actions-inner">
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => handleViewDetails(comp.id)}>
                    View Details
                  </Button>
                  <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => handleDeleteClick(comp.id)} disabled={deleteDialogOpen && deleteId === comp.id && (!deleteName || deleteAwardCount === undefined)}>
                    Delete
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
        {currentPage < totalPages && <PaginationNext href="#" onClick={onNextPage} />}
      </Pagination>
      <CompetitionDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} competitionId={selectedId} />
      <DeleteCompetitionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        competitionName={deleteName}
        awardCount={deleteAwardCount}
      />
    </div>
  );
}

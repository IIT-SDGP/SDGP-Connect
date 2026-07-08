import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { AdminAward } from '@/types/award';
import AwardDetailsDialog from '../dialogs/AwardDetailsDialog';
import DeleteAwardDialog from '../dialogs/DeleteAwardDialog';
import { Pagination, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { useAwardApprovalActions } from '@/hooks/awards/useAwardApprovalActions';
import { toast } from 'sonner';

interface RejectedAwardsTableProps {
  awards: AdminAward[];
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  refresh: () => void;
}

export default function RejectedAwardsTable({ awards, currentPage, totalPages, onNextPage, onPreviousPage, refresh }: RejectedAwardsTableProps) {
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteAwardId, setDeleteAwardId] = React.useState<string | null>(null);

  const { deleteAward, loading: deleteLoading } = useAwardApprovalActions({
    onSuccess: (action) => {
      if (action === 'deleted') {
        toast.success('Award deleted successfully');
        refresh();
        setDeleteOpen(false);
        setDeleteAwardId(null);
      }
    },
    onError: (error) => {
      toast.error('Failed to delete award');
      console.error('Delete award error:', error);
    }
  });
  function handleViewDetails(id: string) {
    setSelectedId(id);
    setDetailsOpen(true);
  }

  function handleDeleteClick(id: string) {
    setDeleteAwardId(id);
    setDeleteOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deleteAwardId) return;
    try {
      await deleteAward(deleteAwardId);
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  function formatShortDate(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = String(date.getFullYear()).slice(-2);
    return `${day} ${month} '${year}`;
  }

  return (
    <div className="admin-table-inner">
      <Table>
        <TableHeader className="admin-table-thead">
          <TableRow>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Project</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Competition</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rejected By</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reject Reason</TableHead>
            <TableHead className="admin-table-actions-head">Actions</TableHead>
          </TableRow>
        </TableHeader>        <TableBody>
          {awards.map((award: AdminAward) => (
            <TableRow key={award.id} className="hover:bg-muted/25">
              <TableCell className="font-medium">{award.name}</TableCell>
              <TableCell>
                <div className="font-medium">{award.project.title}</div>
                <div className="text-xs text-muted-foreground">
                  {award.project.group_num} &bull; SDGP {award.project.sdgp_year}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{award.competition.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatShortDate(award.competition.start_date)} - {formatShortDate(award.competition.end_date)}
                </div>
              </TableCell>
              <TableCell>{award.rejected_by?.name || '-'}</TableCell>
              <TableCell>{award.rejected_reason || '-'}</TableCell>
              <TableCell className="admin-table-actions-cell">
                <div className="admin-table-actions-inner">
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => handleViewDetails(award.id)}>View Details</Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="rounded-lg"
                    onClick={() => handleDeleteClick(award.id)}
                    disabled={deleteLoading}
                  >
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
      </Pagination>      <AwardDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} awardId={selectedId} />
      <DeleteAwardDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}

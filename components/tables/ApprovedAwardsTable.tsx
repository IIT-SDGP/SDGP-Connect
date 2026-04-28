// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { AdminAward } from '@/types/award';
import AwardDetailsDialog from '../dialogs/AwardDetailsDialog';
import RejectAwardDialog from '../dialogs/RejectAwardDialog';
import { Pagination, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { useAwardApprovalActions } from '@/hooks/awards/useAwardApprovalActions';

interface ApprovedAwardsTableProps {
  awards: AdminAward[];
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  refresh: () => void;
}

export default function ApprovedAwardsTable({ awards, currentPage, totalPages, onNextPage, onPreviousPage, refresh }: ApprovedAwardsTableProps) {
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [rejectAwardId, setRejectAwardId] = React.useState<string | null>(null);

  const { rejectAward, loading: actionLoading } = useAwardApprovalActions({
    onSuccess: () => {
      setRejectDialogOpen(false);
      setRejectAwardId(null);
      refresh();
    },
  });
  function handleViewDetails(id: string) {
    setSelectedId(id);
    setDetailsOpen(true);
  }

  function handleReject(id: string) {
    setRejectAwardId(id);
    setRejectDialogOpen(true);
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
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approved By</TableHead>
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
              <TableCell>{award.accepted_by?.name || '-'}</TableCell>
              <TableCell className="admin-table-actions-cell">
                <div className="admin-table-actions-inner">
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => handleViewDetails(award.id)}>View Details</Button>
                  <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => handleReject(award.id)}>Reject</Button>
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
      <AwardDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} awardId={selectedId} />
      <RejectAwardDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={(reason) => rejectAwardId && rejectAward(rejectAwardId, reason)}
        loading={actionLoading}
      />
    </div>
  );
}

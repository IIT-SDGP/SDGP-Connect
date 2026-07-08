import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pagination, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { ApprovedProject } from '@/types/project/response';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

interface ApprovedProjectsTableProps {
  projects: ApprovedProject[];
  onViewDetails: (project: ApprovedProject) => void;
  onToggleFeature: (project: ApprovedProject, featured: boolean) => void;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onReject: (project: ApprovedProject) => void;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  onSortChange: (column: string) => void;
}

export function ApprovedProjectsTable({
  projects,
  onViewDetails,
  onToggleFeature,
  onReject,
  sortBy,
  sortDir,
  onSortChange,
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}: ApprovedProjectsTableProps)
 {
  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDir === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="admin-table-inner">
      <Table>
        <TableHeader className="admin-table-thead">
          <TableRow>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" onClick={() => onSortChange('title')}>
                Title <SortIcon column="title" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" onClick={() => onSortChange('groupNumber')}>
                Group <SortIcon column="groupNumber" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" onClick={() => onSortChange('featured')}>
                Featured <SortIcon column="featured" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" onClick={() => onSortChange('approvedBy')}>
                Approved By <SortIcon column="approvedBy" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" onClick={() => onSortChange('approvedAt')}>
                Approved At <SortIcon column="approvedAt" />
              </Button>
            </TableHead>
            <TableHead className="admin-table-actions-head">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="hover:bg-muted/25">
              <TableCell className="max-w-[260px] truncate font-medium">{project.title}</TableCell>
              <TableCell className="font-medium">#{project.groupNumber}</TableCell>
              <TableCell>
                <Switch
                  checked={project.featured}
                  onCheckedChange={(checked) => onToggleFeature(project, checked)}
                />
              </TableCell>
              <TableCell>{project.approvedBy}</TableCell>
              <TableCell>
                {new Date(project.approvedAt).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TableCell>
              <TableCell className="admin-table-actions-cell">
                <div className="admin-table-actions-inner">
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => onViewDetails(project)}>
                    View Details
                  </Button>
                  <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => onReject(project)}>
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
        {currentPage < totalPages && <PaginationNext href="#" onClick={onNextPage} />}
      </Pagination>
    </div>
  );
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { PendingProject } from '@/types/project/response';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

interface PendingProjectsTableProps {
  projects: PendingProject[];
  selectedProjects: number[];
  onSelectProject: (projectId: number) => void;
  onSelectAll: (checked: boolean) => void;
  onViewDetails: (project: PendingProject) => void;
  onApprove: (project: PendingProject) => void;
  onReject: (project: PendingProject) => void;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function PendingProjectsTable({
  projects,
  selectedProjects,
  onSelectProject,
  onSelectAll,
  onViewDetails,
  onApprove,
  onReject,
  sortBy,
  sortDir,
  onSortChange,
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}: PendingProjectsTableProps) {
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
            <TableHead className="w-12">
              <Checkbox
                checked={selectedProjects.length === projects.length}
                onCheckedChange={(checked) => onSelectAll(checked as boolean)}
              />
            </TableHead>
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
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" onClick={() => onSortChange('submissionDate')}>
                Created <SortIcon column="submissionDate" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground" onClick={() => onSortChange('status')}>
                Status <SortIcon column="status" />
              </Button>
            </TableHead>
            <TableHead className="admin-table-actions-head">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="hover:bg-muted/25">
              <TableCell>
                <Checkbox
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onSelectProject(project.id);
                    } else {
                      onSelectProject(project.id);
                    }
                  }}
                />
              </TableCell>
              <TableCell className="max-w-[260px] truncate font-medium">{project.title}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="rounded-lg px-2 py-0.5">#{project.groupNumber}</Badge>
              </TableCell>
              <TableCell>
                {new Date(project.submissionDate).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TableCell>
              <TableCell>
                <Badge className="rounded-lg">{project.status}</Badge>
              </TableCell>
              <TableCell className="admin-table-actions-cell">
                <div className="admin-table-actions-inner">
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => onViewDetails(project)}>
                    View
                  </Button>
                  <Button size="sm" className="rounded-lg" onClick={() => onApprove(project)}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-lg"
                    onClick={() => onReject(project)}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="border-t border-border/70 px-4 py-3 flex justify-center items-center">
        {currentPage > 1 && <PaginationPrevious href="#"onClick={onPreviousPage} />}
        <span className="mx-2 text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
        {currentPage < totalPages && <PaginationNext href="#" onClick={onNextPage} />}
      </Pagination>
    </div>
  );
}

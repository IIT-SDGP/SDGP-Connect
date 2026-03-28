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
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onSortChange('title')}>
                Title <SortIcon column="title" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onSortChange('groupNumber')}>
                Group <SortIcon column="groupNumber" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onSortChange('featured')}>
                Featured <SortIcon column="featured" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onSortChange('approvedBy')}>
                Approved By <SortIcon column="approvedBy" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onSortChange('approvedAt')}>
                Approved At <SortIcon column="approvedAt" />
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.groupNumber}</TableCell>
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
              <TableCell>
                <Button size="sm" onClick={() => onViewDetails(project)}>
                  View Details
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onReject(project)} className='ml-5'>
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4 flex justify-center items-center">
        {currentPage > 1 && <PaginationPrevious href="#" onClick={onPreviousPage} />}
        <span className="mx-2">Page {currentPage} of {totalPages}</span>
        {currentPage < totalPages && <PaginationNext href="#" onClick={onNextPage} />}
      </Pagination>
    </div>
  );
}

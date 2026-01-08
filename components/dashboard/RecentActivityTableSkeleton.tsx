// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const RecentActivityTableSkeleton: React.FC = () => {
  return (
    <Card className="neo-card w-full mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-medium">
          <Skeleton className="h-7 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-5 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-background/50">
              <TableRow className="hover:bg-transparent border-b border-white/5">
                <TableHead className="font-medium text-muted-foreground">
                  <Skeleton className="h-5 w-32" />
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  <Skeleton className="h-5 w-28" />
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  <Skeleton className="h-5 w-28" />
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  <Skeleton className="h-5 w-24" />
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  <Skeleton className="h-5 w-24" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow 
                  key={index}
                  className={
                    index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'
                  }
                >
                  <TableCell>
                    <Skeleton className="h-5 w-44" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <div className="w-20 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityTableSkeleton;

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
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Activity } from '@/hooks/dashboard/useGetActivity';

interface RecentActivityTableProps {
  activities: Activity[];
  isLoading?: boolean;
  error?: string | null;
}

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({ activities, isLoading = false, error = null }) => {
  const getActionBadgeColor = (actionType: string) => {
    switch(actionType) {
      case 'Approved': return 'bg-green-500/20 text-green-500 border-green-500/20';
      case 'Rejected': return 'bg-red-500/20 text-red-500 border-red-500/20';
      case 'Featured': return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
      case 'Submitted': return 'bg-amber-500/20 text-amber-500 border-amber-500/20';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/20';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      // Yesterday
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      // Less than a week
      return `${diffDays} days ago`;
    } else {
      // More than a week
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className="neo-card w-full mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Recent Activity</CardTitle>
        <CardDescription>Latest updates on projects and reviews</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No recent activity found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-background/50">
                <TableRow className="hover:bg-transparent border-b border-white/5">
                  <TableHead className="font-medium text-muted-foreground">Project Title</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Group Number</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Last Updated</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Action Type</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Action By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity, index) => (
                  <TableRow 
                    key={activity.id}
                    className={cn(
                      "transition-all cursor-pointer", 
                      "hover:bg-white/5",
                      index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'
                    )}
                  >
                    <TableCell className="font-medium">{activity.projectTitle}</TableCell>
                    <TableCell>{activity.groupNumber}</TableCell>
                    <TableCell>{formatDate(activity.lastUpdated)}</TableCell>
                    <TableCell>
                      <Badge className={cn("font-normal border", getActionBadgeColor(activity.actionType))}>
                        {activity.actionType}
                      </Badge>
                    </TableCell>
                    <TableCell>{activity.actionBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityTable;
// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertCircle, FileX2, Inbox } from "lucide-react";
import { useGetCompetitionsByApprovalStatus } from "@/hooks/competition/useGetCompetitionsByApprovalStatus";
import PendingCompetitionsTableSkeleton from "@/components/tables/skeletons/PendingCompetitionsTableSkeleton";
import PendingCompetitionsTable from "@/components/tables/PendingCompetitionsTable";
import ApprovedCompetitionsTableSkeleton from "@/components/tables/skeletons/ApprovedCompetitionsTableSkeleton";
import ApprovedCompetitionsTable from "@/components/tables/ApprovedCompetitionsTable";
import RejectedCompetitionsTableSkeleton from "@/components/tables/skeletons/RejectedCompetitionsTableSkeleton";
import RejectedCompetitionsTable from "@/components/tables/RejectedCompetitionsTable";
import  { ApprovalStatus } from "@/types/prisma-types";


// Type definitions
type TabType = "pending" | "approved" | "rejected";

interface ErrorType {
  message: string;
}

export default function CompetitionManagement() {
  const [currentTab, setCurrentTab] = useState<TabType>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [lastFetchedTime, setLastFetchedTime] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    competitions: pendingCompetitions,
    isLoading: isPendingLoading,
    error: pendingError,
    isEmpty: isPendingEmpty,
    refresh: refreshPending,
    currentPage: pendingCurrentPage,
    totalPages: pendingTotalPages,
    fetchNextPage: fetchPendingNextPage,
    fetchPreviousPage: fetchPendingPreviousPage,
  } = useGetCompetitionsByApprovalStatus(ApprovalStatus.PENDING, debouncedSearchQuery);

  const {
    competitions: approvedCompetitions,
    isLoading: isApprovedLoading,
    error: approvedError,
    isEmpty: isApprovedEmpty,
    refresh: refreshApproved,
    currentPage: approvedCurrentPage,
    totalPages: approvedTotalPages,
    fetchNextPage: fetchApprovedNextPage,
    fetchPreviousPage: fetchApprovedPreviousPage,
  } = useGetCompetitionsByApprovalStatus(ApprovalStatus.APPROVED, debouncedSearchQuery);

  const {
    competitions: rejectedCompetitions,
    isLoading: isRejectedLoading,
    error: rejectedError,
    isEmpty: isRejectedEmpty,
    refresh: refreshRejected,
    currentPage: rejectedCurrentPage,
    totalPages: rejectedTotalPages,
    fetchNextPage: fetchRejectedNextPage,
    fetchPreviousPage: fetchRejectedPreviousPage,
  } = useGetCompetitionsByApprovalStatus(ApprovalStatus.REJECTED, debouncedSearchQuery);

  useEffect(() => {
    setLastFetchedTime(new Date().toLocaleTimeString());
  }, []);

  const handleTabChange = (value: string) => {
    const tabValue = value as TabType;
    setCurrentTab(tabValue);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    if (tabValue === "pending") refreshPending();
    if (tabValue === "approved") refreshApproved();
    if (tabValue === "rejected") refreshRejected();
  };

  const handleRefresh = () => {
    if (currentTab === "pending") refreshPending();
    if (currentTab === "approved") refreshApproved();
    if (currentTab === "rejected") refreshRejected();
    setLastFetchedTime(new Date().toLocaleTimeString());
  };

  const renderError = (error: ErrorType | null) => {
    if (!error) return null;
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  };

  const renderEmptyState = (type: TabType) => {
    const config = {
      pending: {
        title: searchQuery ? "No Matching Pending Competitions" : "No Pending Competitions",
        description: searchQuery
          ? `No pending competitions found matching "${searchQuery}"`
          : "There are no competitions waiting for review.",
        icon: searchQuery ? FileX2 : Inbox,
      },
      approved: {
        title: searchQuery ? "No Matching Approved Competitions" : "No Approved Competitions",
        description: searchQuery
          ? `No approved competitions found matching "${searchQuery}"`
          : "No competitions have been approved yet.",
        icon: FileX2,
      },
      rejected: {
        title: searchQuery ? "No Matching Rejected Competitions" : "No Rejected Competitions",
        description: searchQuery
          ? `No rejected competitions found matching "${searchQuery}"`
          : "No competitions have been rejected.",
        icon: FileX2,
      },
    };

    const selectedConfig = config[type];

    return (
      <div className="flex justify-center items-center p-8">
        <EmptyState
          title={selectedConfig.title}
          description={selectedConfig.description}
          icons={[selectedConfig.icon]}
        />
      </div>
    );
  };

  const renderContent = () => {
    if (currentTab === "pending") {
      if (isPendingLoading) return <PendingCompetitionsTableSkeleton />;
      if (pendingError) return renderError(pendingError);
      if (isPendingEmpty) return renderEmptyState("pending");
      return (
        <PendingCompetitionsTable
          competitions={pendingCompetitions}
          currentPage={pendingCurrentPage}
          totalPages={pendingTotalPages}
          onNextPage={fetchPendingNextPage}
          onPreviousPage={fetchPendingPreviousPage}
          refresh={refreshPending} // pass refresh prop
        />
      );
    }
    if (currentTab === "approved") {
      if (isApprovedLoading) return <ApprovedCompetitionsTableSkeleton />;
      if (approvedError) return renderError(approvedError);
      if (isApprovedEmpty) return renderEmptyState("approved");
      return (
        <ApprovedCompetitionsTable
          competitions={approvedCompetitions}
          currentPage={approvedCurrentPage}
          totalPages={approvedTotalPages}
          onNextPage={fetchApprovedNextPage}
          onPreviousPage={fetchApprovedPreviousPage}
        />
      );
    }
    if (currentTab === "rejected") {
      if (isRejectedLoading) return <RejectedCompetitionsTableSkeleton />;
      if (rejectedError) return renderError(rejectedError);
      if (isRejectedEmpty) return renderEmptyState("rejected");
      return (
        <RejectedCompetitionsTable
          competitions={rejectedCompetitions}
          currentPage={rejectedCurrentPage}
          totalPages={rejectedTotalPages}
          onNextPage={fetchRejectedNextPage}
          onPreviousPage={fetchRejectedPreviousPage}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Competition Management</h1>
        <p className="text-muted-foreground">Review and manage competition submissions</p>
      </div>
      <Tabs defaultValue="pending" onValueChange={handleTabChange} value={currentTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <div className="my-4 flex flex-wrap gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search competitions..."
              className="max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setDebouncedSearchQuery("");
                }}
              >
                Clear
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleRefresh}>
              Last Fetched: {lastFetchedTime}
              <RefreshCcw />
            </Button>
          </div>
        </div>
        {renderContent()}
      </Tabs>
    </div>
  );
}
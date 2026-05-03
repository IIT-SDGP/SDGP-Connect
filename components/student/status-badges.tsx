import { ApprovalStatus } from '@/types/prisma-types';

import { Badge } from '@/components/ui/badge';

export function getBlogStatus(post: { approved: boolean; rejectedById?: string | null }) {
  if (post.approved) return 'approved';
  if (post.rejectedById) return 'rejected';
  return 'pending';
}

export function BlogStatusBadge(post: { approved: boolean; rejectedById?: string | null }) {
  const status = getBlogStatus(post);

  if (status === 'approved') {
    return <Badge>Approved</Badge>;
  }

  if (status === 'rejected') {
    return <Badge variant='destructive'>Rejected</Badge>;
  }

  return <Badge variant='secondary'>Pending</Badge>;
}

export function AwardStatusBadge({ status }: { status: ApprovalStatus }) {
  if (status === ApprovalStatus.APPROVED) {
    return <Badge>Approved</Badge>;
  }

  if (status === ApprovalStatus.REJECTED) {
    return <Badge variant='destructive'>Rejected</Badge>;
  }

  return <Badge variant='secondary'>Pending</Badge>;
}

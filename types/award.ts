// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

export interface AwardSubmissionInput {
  projectId: string;
  competitionId: string;
  awardName: string;
  imageFile: File;
}

export interface AdminAward {
  id: string;
  name: string;
  image?: string;
  competition: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
  };
  project: {
    project_id: string;
    title: string;
    group_num: string;
    sdgp_year: string;
  };
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  accepted_by?: { name: string } | null;
  rejected_by?: { name: string } | null;
  rejected_reason?: string | null;
  createdAt: string;
  updatedAt: string;
}

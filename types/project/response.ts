// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
export interface SubmitProjectResponse {
  success: boolean;
  message: string;
  code?: string;
  details?: string;
  error?: string;
  data?: {
    projectId: string;
  };
  errors?: any;
}

export interface PendingProject {
  id: number;
  title: string;
  groupNumber: string;
  submissionDate: string;
  status: string;
}

export interface RejectedProject {
  id: number;
  title: string;
  groupNumber: string;
  rejectedBy: string;
  rejectedAt: string;
  rejectionReason: string;
}

export interface ApprovedProject {
  id: number;
  title: string;
  groupNumber: string;
  featured: boolean;
  approvedBy: string;
  approvedAt: string;
}

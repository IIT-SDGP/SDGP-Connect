// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { Role } from "@/types/prisma-types";

export interface User {
  id: string;
  role: Role;
  password?: string | null;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  approvedProjects: string[];
  featuredProjects: string[];
  createdAt: Date;
  updatedAt: Date;
}
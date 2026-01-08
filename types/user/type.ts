// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

export enum Role {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    DEVELOPER = "DEVELOPER"
  }
  
  export interface User {
    user_id: string;
    role: Role;
    password: string;
    name: string;
    approvedProjects: string[]; // Array of project IDs
    featuredProjects: string[]; // Array of project metadata IDs
    createdAt: Date;
    updatedAt: Date;
  }
  
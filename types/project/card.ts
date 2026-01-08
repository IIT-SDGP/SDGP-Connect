// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { ProjectDomainEnum, ProjectStatusEnum, ProjectTypeEnum } from "@/types/prisma-types";

export interface ProjectCardType {
  id: string;
  title: string;
  subtitle?: string;
  coverImage?: string;
  status: ProjectStatusEnum;
  projectTypes: ProjectTypeEnum[];
  domains: ProjectDomainEnum[];
}

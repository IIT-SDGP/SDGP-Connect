// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { AssociationType, ProjectApprovalStatus, ProjectDomainEnum, ProjectStatusEnum, ProjectTypeEnum, SDGGoalEnum, SocialTypeEnum, TechStackEnum } from "@/types/prisma-types";
import { IconType } from "react-icons/lib";
import { User } from "../user/type";

export interface IProject {
    metadata: IProjectMetadata;
    content?: IProjectContent;
}

export interface IProjectMetadata {
    project_id: string;
    sdgp_year: string;
    group_num: string;
    title: string;
    subtitle?: string;
    website?: string;
    cover_image?: string;
    logo?: string;
    featured: boolean;
    featured_by_userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProjectContent {
    content_id: string;
    metadata_id: string; // Changed from project_id to metadata_id
    projectDetails?: IProjectDetails;
    status?: IProjectStatus;
    associations: IProjectAssociation[];
    slides: IProjectSlide[];
    team: IProjectTeam[];
    socialLinks: IProjectSocialLink[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProjectDetails {
    id: string;
    content_id: string; // Changed from project_id to content_id
    problem_statement: string;
    solution: string;
    features: string;
    team_email: string;
    team_phone: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProjectStatus {
    content_id: string;
    status: ProjectStatusEnum;
    approved_status: ProjectApprovalStatus;
    approved_at?: Date;
    approved_by?: User;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProjectAssociation {
    id: string;
    content_id: string; // Changed from project_id to content_id
    type: AssociationType;
    value: string;
    domain?: ProjectDomainEnum;
    projectType?: ProjectTypeEnum;
    sdgGoal?: SDGGoalEnum;
    techStack?: TechStackEnum;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProjectSlide {
    id: string;
    content_id: string; // Changed from project_id to content_id
    slides_content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProjectTeam {
    member_id: string;
    content_id: string; // Changed from project_id to content_id
    name: string;
    linkedin_url?: string;
    profile_image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProjectSocialLink {
    id: string;
    content_id: string; 
    link_name: SocialTypeEnum;
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type StackType = "frontend" | "backend" | "mobile" | "cloud" | "database" | "ai" | "hardware";

export type TechStackItem = {
    value: string;
    label: string;
    type: StackType;
    icon?: IconType;
};

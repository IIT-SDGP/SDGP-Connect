// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import {
  ProjectDomainEnum,
  ProjectStatusEnum,
  ProjectTypeEnum,
  SDGGoalEnum,
  TechStackEnum,
  SocialTypeEnum
} from "@/types/prisma-types";
import { z } from "zod";

// Custom URL validator that provides specific error messages
const urlWithProtocolValidator = z.string()
  .refine(
    (url: string) => {
      if (!url.trim()) return true; // Empty is handled separately
      return /^https?:\/\/.+/.test(url);
    },
    {
      message: "URL must include HTTPS:// or HTTP:// (e.g., https://example.com)"
    }
  )
  .refine(
    (url: string) => {
      if (!url.trim()) return true;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Must be a valid URL"
    }
  );

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  linkedin_url: z.string().url().or(z.string().length(0)).optional(),
  profile_image: z.any().optional().nullable(),
});

// Convert enum objects to Zod enums
const projectStatusSchema = z.nativeEnum(ProjectStatusEnum);
const projectDomainSchema = z.nativeEnum(ProjectDomainEnum);
const projectTypeSchema = z.nativeEnum(ProjectTypeEnum);
const sdgGoalSchema = z.nativeEnum(SDGGoalEnum);
const techStackSchema = z.nativeEnum(TechStackEnum);
const socialTypeSchema = z.nativeEnum(SocialTypeEnum);

export const projectSubmissionSchema = z.object({
  metadata: z.object({
    sdgp_year: z.string().min(1, "Year is required"),
    group_num: z.string().min(1, "Team number is required"),
    title: z.string().min(1, "Title is required").max(100),
    subtitle: z.string().optional().nullable(),
    website: z.string()
      .refine(
        (url: string) => {
          if (!url.trim()) return true; // Allow empty
          return /^https?:\/\/.+/.test(url);
        },
        {
          message: "URL must include HTTPS:// or HTTP:// (e.g., https://example.com)"
        }
      )
      .refine(
        (url: string) => {
          if (!url.trim()) return true;
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Must be a valid URL"
        }
      )
      .or(z.string().length(0))
      .optional()
      .nullable(),
    cover_image: z.any().refine((file: any) => file != null, {
      message: "Cover image is required",
    }),
    logo: z.any().refine((file: any) => file != null, {
      message: "Logo is required",
    }),
    module: z.string().optional(),
  }),
  projectDetails: z.object({
    problem_statement: z.string().min(1, "Problem statement is required"),
    solution: z.string().min(1, "Solution is required"),
    features: z.string().min(1, "Features are required"),
    team_email: z.string().email("Must be a valid email"),
    team_phone: z.string().optional(), // This is just for storage, no validation
    country_code: z.string()
      .min(1, "Country code is required")
      .regex(/^\+\d{1,4}$/, "Country code must be in format +XX (1-4 digits)"),
    phone_number: z.string()
      .min(1, "Phone number is required")
      .max(10, "Phone number cannot exceed 10 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"),
  }),
  status: z.object({
    status: projectStatusSchema,
  }),
  // Associations using proper enums
  domains: z.array(projectDomainSchema).min(1, "Select at least one domain"),
  projectTypes: z.array(projectTypeSchema).min(1, "Select at least one project type"),
  sdgGoals: z.array(sdgGoalSchema).optional(),
  techStack: z.array(techStackSchema).min(1, "Select at least one technology"),
  // Team members
  team: z.array(teamMemberSchema).min(1, "Add at least one team member"),
  // Social links
  socialLinks: z.array(
    z.object({
      link_name: socialTypeSchema,
      url: z.string()
        .refine(
          (url: string) => {
            if (!url.trim()) return true;
            return /^https?:\/\/.+/.test(url);
          },
          {
            message: "URL must include HTTPS:// or HTTP:// (e.g., https://linkedin.com/in/...)"
          }
        )
        .refine(
          (url: string) => {
            if (!url.trim()) return true;
            try {
              new URL(url);
              return true;
            } catch {
              return false;
            }
          },
          {
            message: "Must be a valid URL"
          }
        ),
    })
  ).optional(),
  // Slides content
  slides: z.array(
    z.object({
      slides_content: z.string().min(1, "Slide content is required"),
    })
  ).min(3, "You must upload at least 3 images")
    .max(10, "You can upload a maximum of 10 images")
    .refine((slides: any) => slides.length >= 3, {
      message: "At least 3 images are required to proceed"
    }),
});

export type ProjectSubmissionSchema = z.infer<typeof projectSubmissionSchema>;
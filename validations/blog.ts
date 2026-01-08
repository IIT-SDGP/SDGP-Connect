// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { z } from "zod";
import { ProjectDomainEnum } from "@/types/prisma-types";

// Helper to normalize social URLs
function normalizeUrl(url: string, type: string): string {
  if (!url) return "";
  let trimmed = url.trim();
  // Remove leading @ for handles
  trimmed = trimmed.replace(/^@/, "");
  // Add protocol if missing
  if (!/^https?:\/\//i.test(trimmed)) {
    if (type === "instagram") return `https://instagram.com/${trimmed}`;
    if (type === "twitter") return `https://twitter.com/${trimmed}`;
    if (type === "facebook") return `https://facebook.com/${trimmed}`;
    if (type === "linkedin") return `https://linkedin.com/in/${trimmed}`;
    if (type === "medium") return `https://medium.com/@${trimmed}`;
    if (type === "website") return `https://${trimmed}`;
  }
  return trimmed;
}

// Blog Author Schema
export const blogAuthorSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Invalid email format"),
  avatarUrl: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  instagram: z.string().max(100, "Instagram URL too long").optional().or(z.literal(""))
    .transform((val) => normalizeUrl(val ?? "", "instagram"))
    .refine((val) => !val || /^https?:\/\/(www\.)?instagram\.com\//.test(val), { message: "Must be a valid Instagram URL" }),
  twitter: z.string().max(100, "Twitter URL too long").optional().or(z.literal(""))
    .transform((val) => normalizeUrl(val ?? "", "twitter"))
    .refine((val) => !val || /^https?:\/\/(www\.)?twitter\.com\//.test(val), { message: "Must be a valid Twitter URL" }),
  facebook: z.string().max(100, "Facebook URL too long").optional().or(z.literal(""))
    .transform((val) => normalizeUrl(val ?? "", "facebook"))
    .refine((val) => !val || /^https?:\/\/(www\.)?facebook\.com\//.test(val), { message: "Must be a valid Facebook URL" }),
  linkedin: z.string().max(100, "LinkedIn URL too long").optional().or(z.literal(""))
    .transform((val) => normalizeUrl(val ?? "", "linkedin"))
    .refine((val) => !val || /^https?:\/\/(www\.)?linkedin\.com\//.test(val), { message: "Must be a valid LinkedIn URL" }),
  medium: z.string().max(100, "Medium URL too long").optional().or(z.literal(""))
    .transform((val) => normalizeUrl(val ?? "", "medium"))
    .refine((val) => !val || /^https?:\/\/(www\.)?medium\.com\//.test(val), { message: "Must be a valid Medium URL" }),
  website: z.string().max(100, "Website URL too long").optional().or(z.literal(""))
    .transform((val) => normalizeUrl(val ?? "", "website"))
    .refine((val) => !val || /^https?:\/\//.test(val), { message: "Must be a valid website URL" }),
});

// Blog Post Schema
export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(180, "Title cannot exceed 180 characters"),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt cannot exceed 500 characters"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  category: z.nativeEnum(ProjectDomainEnum, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  featured: z.boolean().default(false),
});

// Combined schema for full blog submission
export const blogSubmissionSchema = z.object({
  author: blogAuthorSchema,
  post: blogPostSchema,
});

// Author check schema
export const authorCheckSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type BlogAuthorSchema = z.infer<typeof blogAuthorSchema>;
export type BlogPostSchema = z.infer<typeof blogPostSchema>;
export type BlogSubmissionSchema = z.infer<typeof blogSubmissionSchema>;
export type AuthorCheckSchema = z.infer<typeof authorCheckSchema>;

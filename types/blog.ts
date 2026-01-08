// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

export type BlogAuthor = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  instagram: string | null;
  twitter: string | null;
  facebook: string | null;
  linkedin: string | null;
  medium: string | null;
  website: string | null;
  createdAt?: string | Date; // Make createdAt optional and allow string for API
  updatedAt?: string | Date;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  publishedAt: Date;
  authorId: string;
  category: string;
  featured: boolean;
  approved: boolean;
  approvedById: string | null;
  rejectedById: string | null;
  rejectedReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  author?: BlogAuthor;
};

export type BlogFormData = {
  author: {
    email: string;
    name: string;
    avatarUrl?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    medium?: string;
    website?: string;
    found: boolean;
    verified: boolean; // Add verification status
  };  meta: {
    title: string;
    excerpt: string;
    category: string;
    imageUrl?: string;
  };
  content: string;
  featured: boolean;
};

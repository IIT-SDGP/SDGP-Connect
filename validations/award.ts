// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { z } from 'zod';

const awardNameSchema = z
  .string()
  .min(1, 'Award name is required')
  .max(25, 'Award name must be 25 characters or less');

const awardBaseSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  competitionId: z.string().min(1, 'Competition is required'),
  awardName: awardNameSchema,
});

export const awardSubmissionSchema = awardBaseSchema.extend({
  imageFile: z.custom<File>().superRefine((value, ctx) => {
    if (typeof File === 'undefined' || !(value instanceof File)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Image file is required' });
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(value.type)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Image must be JPG or PNG' });
    }

    if (value.size > 5 * 1024 * 1024) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Image size must be less than 5MB' });
    }
  }),
});

export const awardPayloadSchema = awardBaseSchema.extend({
  image: z
    .string()
    .min(1, 'Award image is required')
    .url('Award image must be a valid URL'),
});

export type AwardSubmissionInput = z.infer<typeof awardSubmissionSchema>;
export type AwardPayloadInput = z.infer<typeof awardPayloadSchema>;

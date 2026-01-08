// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { z } from 'zod';

export const awardSubmissionSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  competitionId: z.string().min(1, 'Competition is required'),
  awardName: z.string().min(1, 'Award name is required').max(25, 'Award name must be 25 words or less'),
  imageFile: z
    .instanceof(File)
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'Image must be JPG or PNG',
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'Image size must be less than 5MB',
    }),
});

export type AwardSubmissionInput = z.infer<typeof awardSubmissionSchema>;

// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { z } from "zod";

// Define competition types enum
export const CompetitionTypeEnum = z.enum([
  "HACKATHON",
  "IDEATHON", 
  "EXPO",
  "WORKSHOP"
]);

export const competitionSchema = z.object({
  name: z.string().min(1, "Competition name is required").max(100, "Name cannot exceed 100 characters"),
  type: CompetitionTypeEnum,
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
  logo: z.any().refine((file) => file != null, {
    message: "Logo is required",
  }),
  cover_image: z.any().refine((file) => file != null, {
    message: "Cover image is required",
  }),
}).refine((data) => {
  return data.end_date > data.start_date;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
});

export type CompetitionSchema = z.infer<typeof competitionSchema>;

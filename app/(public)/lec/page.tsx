// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import type { Metadata } from "next";

import LectureSession from "@/components/lec/lecture-session";
import { lectureMeeting } from "@/data/lectureMeeting";

export const metadata: Metadata = {
  title: "SDGP Lecture",
  description: lectureMeeting.subtitle,
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center text-white pb-24">
      <LectureSession />
    </div>
  );
}

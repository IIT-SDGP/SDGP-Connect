// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Merged left/right card glow — avoids a visible gap in the center */
export const dualGlowBg =
  "bg-[radial-gradient(circle_at_12%_20%,rgba(99,102,241,0.12),transparent_55%),radial-gradient(circle_at_88%_80%,rgba(34,197,246,0.08),transparent_55%)]"

/** Wider hero/page ambient glow */
export const heroGlowBg =
  "bg-[radial-gradient(circle_at_15%_0%,rgba(99,102,241,0.14),transparent_65%),radial-gradient(circle_at_85%_10%,rgba(34,197,246,0.08),transparent_65%)]"

/** Clears fixed left dock nav; symmetric horizontal inset on md+ */
export const dockNavClearance =
  "md:px-[6.5rem] lg:px-[6.75rem]"

/** @deprecated alias — use dockNavClearance */
export const projectContentInset = dockNavClearance

export const projectContentShell = cn(
  "w-full min-w-0",
  dockNavClearance,
  "px-3 sm:px-4 md:px-0",
)

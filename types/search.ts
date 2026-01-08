// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

// Types for project search
export interface ProjectSearchResult {
  project_id: string;
  title: string;
  logo: string | null;
  group_num: string;
  sdgp_year: string;
}

// Types for competition search
export interface CompetitionSearchResult {
  id: string;
  name: string;
  logo: string | null;
  start_date: Date;
  end_date: Date;
}

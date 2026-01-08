// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { useState, useEffect } from 'react';

export function useApprovedAwards() {
  const [awards, setAwards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/admin/awards/approved')
      .then((res) => res.json())
      .then((data) => setAwards(data))
      .finally(() => setIsLoading(false));
  }, []);

  return { awards, isLoading };
}

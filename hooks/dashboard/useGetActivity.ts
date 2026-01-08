// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

'use client';

import { useState, useEffect } from 'react';

export interface Activity {
  id: string;
  projectTitle: string;
  groupNumber: string;
  lastUpdated: string;
  actionType: 'Approved' | 'Rejected' | 'Featured' | 'Submitted';
  actionBy: string;
}

export default function useGetActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/dashboard/activity');
        
        if (!response.ok) {
          throw new Error('Failed to fetch activity data');
        }
        
        const data = await response.json();
        setActivities(data.activities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching activity data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, isLoading, error };
}

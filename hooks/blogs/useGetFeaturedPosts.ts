"use client"
// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BlogPost } from '@/types/blog';

interface UseGetFeaturedPostsOptions {
  limit?: number;
}

interface UseGetFeaturedPostsReturn {
  featuredPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGetFeaturedPosts = (options: UseGetFeaturedPostsOptions = {}): UseGetFeaturedPostsReturn => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }

      const response = await axios.get(`/api/blogs/featured?${params}`);
      
      if (response.data.success) {
        setFeaturedPosts(response.data.data || []);
      } else {
        throw new Error(response.data.error || 'Failed to fetch featured posts');
      }
      
    } catch (err) {
      console.error('Error fetching featured posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch featured posts');
      setFeaturedPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchFeaturedPosts();
  };

  useEffect(() => {
    fetchFeaturedPosts();
  }, [options.limit]);

  return {
    featuredPosts,
    isLoading,
    error,
    refetch
  };
};

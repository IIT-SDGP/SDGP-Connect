// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client"

import { useState, useMemo } from "react";
import { BlogPost } from "@/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogFilter } from "@/components/blog/BlogFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FeaturedBlogCard } from "@/components/blog/FeaturedBlogCard";
import { FeaturedBlogCardSkeleton } from "@/components/blog/FeaturedBlogCardSkeleton";
import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";
import Link from "next/link";
import { useGetAllBlogs } from "@/hooks/blogs/useGetAllBlogs";
import { useGetFeaturedPosts } from "@/hooks/blogs/useGetFeaturedPosts";
import { formatCategoryForApi } from "@/lib/blog-utils";

interface BlogContentProps {
  // Optional props for SSR data, but we'll use hooks for real-time data
  initialPosts?: BlogPost[];
  featuredPosts?: BlogPost[];
}

/**
 * BlogContent - Client Component
 * 
 * This component handles all the interactive functionality for the blog:
 * - Search functionality
 * - Category filtering
 * - Dynamic post rendering
 * - State management
 * - Real-time data fetching from API
 */
export function BlogContent({ initialPosts = [], featuredPosts: initialFeaturedPosts = [] }: BlogContentProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Memoize the category to avoid infinite re-renders
  const formattedCategory = useMemo(() => formatCategoryForApi(activeCategory), [activeCategory]);
  
  // Use separate hooks for featured and all posts
  const { featuredPosts, isLoading: isFeaturedLoading, error: featuredError } = useGetFeaturedPosts({
    limit: 2
  });
  
  const { posts: allPosts, isLoading, isLoadingMore, error, hasMore, loadMore } = useGetAllBlogs({
    category: formattedCategory,
    search: searchQuery || undefined,
    limit: 9,
  
  });

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    let posts = allPosts;
    
    // If we have search query, the API already filtered
    if (!searchQuery && activeCategory !== "All") {
      posts = allPosts.filter((post: BlogPost) => {
        const categoryFormatted = formatCategoryForApi(activeCategory);
        return post.category === categoryFormatted;
      });
    }
    
    return posts;
  }, [allPosts, activeCategory, searchQuery]);// Separate featured and regular posts for display
  // When there are search/category filters, show all posts including featured ones
  // When on main page, featured posts are excluded from allPosts via API
  const regularPosts = filteredPosts;
  if (error || featuredError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Posts</h2>
          <p className="text-muted-foreground mb-4">{error || featuredError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className=" py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
              Our Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover insights, innovations, and stories that inspire change and drive sustainable development.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10 py-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <BlogFilter 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Search Results Info */}
          {searchQuery && (
            <div className="text-center mb-8">              <p className="text-muted-foreground">
                Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} 
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>          )}          {/* Featured Posts Section */}
          {!searchQuery && activeCategory === "All" && (
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Left Side - Title Section */}
                <div className="flex flex-col justify-center lg:pr-12 mb-8 lg:mb-0">
                  <h2 className="text-5xl font-extrabold mb-6 leading-tight text-white text-left">
                    Featured Projects
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 text-left">
                    Discover our featured articles that highlight innovative solutions and impactful stories from our community.
                  </p>
                  <Link href="/blog/create" className="inline-flex items-center text-primary font-semibold hover:underline">
                  <button className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-semibold text-base shadow text-left w-fit">
                    Add your Articles
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                    </Link>
                </div>
                {/* Right Side - Featured Project Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {isFeaturedLoading ? (
                    <>
                      <FeaturedBlogCardSkeleton />
                      <FeaturedBlogCardSkeleton />
                    </>
                  ) : (
                    featuredPosts.slice(0, 2).map((post: BlogPost) => (
                      <Link key={post.id} href={`/blog/${post.id}`} className="block h-full">
                        <FeaturedBlogCard post={post} />
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}          {/* Regular Posts Section */}
          {isLoading ? (
            <div>
              {!searchQuery && activeCategory === "All" && (
                <h2 className="text-5xl font-extrabold mb-8 text-center leading-tight">Latest Articles</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-full flex">
                    <BlogCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div>
              {!searchQuery && activeCategory === "All" && featuredPosts.length > 0 && (
                <h2 className="text-5xl font-extrabold mb-8 text-center leading-tight">Latest Articles</h2>
              )}<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {(searchQuery || activeCategory !== "All" ? filteredPosts : regularPosts).map((post: BlogPost) => (
                  <div key={post.id} className="h-full flex">
                    <BlogCard post={post} className="flex-1 h-full" />
                  </div>
                ))}
              </div>
                {/* Load More Button for Infinite Scroll */}
              {hasMore && !searchQuery && activeCategory === "All" && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      'Load More Articles'
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* No Results */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">No articles found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No articles match your search for "${searchQuery}". Try different keywords or browse our categories.`
                    : `No articles found in the "${activeCategory}" category.`
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  View All Articles
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

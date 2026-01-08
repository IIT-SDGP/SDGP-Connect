// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { BlogPost } from "@/types/blog";
import { getDisplayFromEnum, formatDateForDisplay, calculateReadTime } from "@/lib/blog-utils";

interface FeaturedBlogCardProps {
  post: BlogPost;
}

export function FeaturedBlogCard({ post }: FeaturedBlogCardProps) {
  const readTime = calculateReadTime(post.content);
  const categoryDisplay = getDisplayFromEnum(post.category);
  const formattedDate = formatDateForDisplay(post.publishedAt);

  return (
    <div
      className="bg-black/95 border border-gray-800 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-gray-700 flex flex-col"
    >
      {/* Image Section */}
      <div className="bg-gradient-to-br from-gray-200 to-gray-300 aspect-video flex items-center justify-center m-4 rounded-2xl relative overflow-hidden">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <svg className="w-16 h-16 text-gray-400 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        )}
        {/* Category and Read Time - positioned at bottom left of image */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <span className="bg-black text-white font-semibold text-xs px-3 py-1.5 rounded-full">
            {categoryDisplay}
          </span>
          
        </div>
      </div>
      {/* Content Section */}
      <div className="px-6 pb-6">
        {/* Title */}
        <h3 className="text-2xl font-bold text-white leading-tight mb-3 line-clamp-2">
          {post.title}
        </h3>
        {/* Excerpt */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>
        {/* Author and Date */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
            {post.author?.avatarUrl ? (
              <img 
                src={post.author.avatarUrl} 
                alt={post.author.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {post.author?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">{post.author?.name || 'Anonymous'}</span>
            <span className="text-gray-500 text-xs">{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

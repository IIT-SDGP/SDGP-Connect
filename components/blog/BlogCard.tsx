// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { getDisplayFromEnum, formatDateForDisplay, calculateReadTime } from "@/lib/blog-utils";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className = "" }: BlogCardProps) {
  const formattedDate = formatDateForDisplay(post.publishedAt);
  const readTime = calculateReadTime(post.content);
  const categoryDisplay = getDisplayFromEnum(post.category);

  return (
    <div className={`group transition-all duration-300 hover:shadow-lg ${className}`}> 
      <div className="relative flex flex-col h-full">
        <div className="w-full flex justify-start mb-4">
          <div className="max-w-[60%] w-full aspect-video bg-muted rounded-xl overflow-hidden flex items-center justify-center relative">
            <Image
              src={post.imageUrl || '/placeholder.svg'}
              alt={post.title}
              width={400}
              height={225}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <Badge 
              variant="secondary" 
              className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm"
            >
              {categoryDisplay}
            </Badge>
          </div>
        </div>
        <Link href={`/blog/${post.id}`} className="group flex flex-col gap-2">
          <h3 className="font-bold group-hover:text-primary transition-colors duration-200 mb-1 text-3xl">
            {post.title}
          </h3>
          <p className="text-muted-foreground mb-2 text-base line-clamp-2">
            {post.excerpt}
          </p>
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <Image
            src={post.author?.avatarUrl || '/user.png'}
            alt={post.author?.name || 'Author'}
            width={32}
            height={32}
            className="rounded-full object-cover border border-border"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-medium text-foreground text-base">{post.author?.name || 'Anonymous'}</span>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          <Link href={`/blog/${post.id}`} target="_blank" rel="noopener noreferrer" className="ml-2 flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

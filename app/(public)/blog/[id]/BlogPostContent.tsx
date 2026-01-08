// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  ClockIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  CopyIcon,
  CheckIcon,
  InstagramIcon,
  XIcon,
  SunMediumIcon,
  BluetoothSearchingIcon,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useGetPostById } from "@/hooks/blogs/useGetPostById";
import { useGetRecentPosts } from "@/hooks/blogs/useGetRecentPosts";
import { useGetPostsByCategory } from "@/hooks/blogs/useGetPostsByCategory";
import { getDisplayFromEnum, formatDateForDisplay, calculateReadTime } from "@/lib/blog-utils";
import MarkdownPreview from "@/components/blog/MarkdownPreview";
import BlogPostSkeleton from "@/components/blog/BlogPostSkeleton";

export default function BlogPostContent({ id }: { id: string }) {
  const { post, isLoading, error } = useGetPostById(id);
  
  // Memoize the options to prevent infinite re-renders
  const recentPostsOptions = useMemo(() => ({ limit: 3 }), []);
  const relatedPostsOptions = useMemo(() => ({ 
    category: post?.category, 
    limit: 10 
  }), [post?.category]);
  
  const { posts: recentPosts } = useGetRecentPosts(recentPostsOptions);
  const { posts: relatedPosts } = useGetPostsByCategory(relatedPostsOptions);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    });
  };

  if (isLoading) {
    return <BlogPostSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = formatDateForDisplay(post.publishedAt);
  const readTime = calculateReadTime(post.content);
  const categoryDisplay = getDisplayFromEnum(post.category);

  return (
    <section className="py-16 flex justify-center items-center">
      <div className="container sm:px-8 md:px-8 lg:px-16 xl:px-24">
        <div className="relative mb-12 h-[600px] overflow-hidden">
          <Image            src={post.imageUrl || '/placeholder.svg'}
            alt="Blog post cover image"
            width={1200}
            height={600}
            className="h-full w-full rounded-lg object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-end rounded-lg bg-gradient-to-r from-black/70 to-black/30 p-8 text-white">
            <h1 className="mb-4 text-5xl font-bold leading-tight">{post.title}</h1>
            <div className="mb-4 flex items-center  space-x-4">              <Avatar className="size-12 ring-2 ring-primary ring-offset-2 ring-offset-background">
                <AvatarImage src={post.author?.avatarUrl || '/default-avatar.png'} alt={post.author?.name || 'Author'} />
                <AvatarFallback>{post.author?.name?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div className="">
                <p className="text-xl font-semibold">{post.author?.name || 'Anonymous'}</p>
                <p className="text-sm opacity-75"> {post.author?.createdAt ? (
                          <>since {formatDateForDisplay(post.author.createdAt)}</>
                        ) : (
                          'Contributor'
                        )}</p>
              </div>
            </div>
            <div className="mb-4 flex items-center text-sm">
              <CalendarIcon className="mr-2 size-5" />              <time dateTime={post.publishedAt.toString()} className="mr-4">
                {formattedDate}
              </time>
            </div>            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-background/10 text-white hover:bg-background/20">
                {categoryDisplay}
              </Badge>
            </div>
          </div>
        </div>
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">          <div className="md:col-span-8 lg:col-span-9">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              <MarkdownPreview 
                content={post.content || "No content available."} 
                className="text-foreground px-8"
              />
            </article>
          </div>
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-20 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Share this article</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <TwitterIcon className="size-4" />
                      <span className="sr-only">Share on Twitter</span>
                    </Button>
                    <Button variant="outline" size="icon">
                      <FacebookIcon className="size-4" />
                      <span className="sr-only">Share on Facebook</span>
                    </Button>
                    <Button variant="outline" size="icon">
                      <LinkedinIcon className="size-4" />
                      <span className="sr-only">Share on LinkedIn</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleCopyLink}>
                      {copySuccess ? <CheckIcon className="size-4 text-green-500" /> : <CopyIcon className="size-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>About the Author</CardTitle>
                </CardHeader>
                <CardContent>                  <div className="flex items-center space-x-4">
                    <Avatar className="size-10 ring-2 ring-primary ring-offset-2 ring-offset-background">
                      <AvatarImage src={post.author?.avatarUrl|| ""} alt={post.author?.name || 'Author'} />
                      <AvatarFallback>{post.author?.name?.[0] || 'A'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{post.author?.name || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.author?.createdAt ? (
                          <>since {formatDateForDisplay(post.author.createdAt)}</>
                        ) : (
                          'Contributor'
                        )}
                      </p>
                    </div>
                  </div>                  <Separator className="my-4" />
                  <ul className="space-y-2">
                    {post.author?.instagram && (
                      <li className="flex items-center space-x-2">
                        <InstagramIcon className="size-4" />
                        <Link
                          href={post.author.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          Instagram
                        </Link>
                      </li>
                    )}
                    {post.author?.facebook && (
                      <li className="flex items-center space-x-2">
                        <FacebookIcon className="size-4" />
                        <Link
                          href={post.author.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          Facebook
                        </Link>
                      </li>
                    )}
                    {post.author?.twitter && (
                      <li className="flex items-center space-x-2">
                        <XIcon className="size-4" />
                        <Link
                          href={post.author.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          X
                        </Link>
                      </li>
                    )}
                    {post.author?.medium && (
                      <li className="flex items-center space-x-2">
                        <SunMediumIcon className="size-4" />
                        <Link
                          href={post.author.medium}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          Medium
                        </Link>
                      </li>
                    )}
                    {post.author?.linkedin && (
                      <li className="flex items-center space-x-2">
                        <LinkedinIcon className="size-4" />
                        <Link
                          href={post.author.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          LinkedIn
                        </Link>
                      </li>
                    )}
                    {post.author?.website && (
                      <li className="flex items-center space-x-2">
                        <BluetoothSearchingIcon className="size-4" />
                        <Link
                          href={post.author.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          Website
                        </Link>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Related Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {relatedPosts
                      .filter((relatedPost) => relatedPost.id !== post.id)
                      .slice(0, 10)
                      .map((relatedPost) => (
                        <li key={relatedPost.id}>
                          <Link
                            href={`/blog/${relatedPost.id}`}
                            className="text-sm hover:underline"
                          >
                            {relatedPost.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

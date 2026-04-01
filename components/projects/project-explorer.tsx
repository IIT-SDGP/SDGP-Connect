// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
// filepath: d:\MyProjects\LEXi\SDGP-Connect\components\projects\project-explorer.tsx
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton"; 
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ProjectQueryParams } from "@/hooks/project/useGetProjects";
import { EmptyState } from "../ui/empty-state";
import { FileX2, ArrowUp } from "lucide-react";
import { useEffect, useRef, useCallback, useState } from 'react';

interface ProjectExplorerProps {
    currentParams: ProjectQueryParams; 
    projects: any[];
    isLoading: boolean;
    error: string | null;
    meta: any;
    hasMore: boolean;
    loadMore: () => void;
}

export default function ProjectExplorer({ currentParams, projects, isLoading, error, meta, hasMore, loadMore }: ProjectExplorerProps) {
    // Create a ref for the loader element (at bottom of list)
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Use refs to store latest values without triggering observer recreation
    const loadMoreRef = useRef(loadMore);
    const hasMoreRef = useRef(hasMore);
    const isLoadingRef = useRef(isLoading);

    // Keep refs up to date
    useEffect(() => {
        loadMoreRef.current = loadMore;
    }, [loadMore]);

    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    // Setup the intersection observer for infinite scrolling
    // Only recreate when projects array length changes (new last element)
    const lastProjectElementRef = useCallback((node: HTMLDivElement) => {
        // Disconnect any existing observer
        if (observerRef.current) observerRef.current.disconnect();

        if (!node) return;

        observerRef.current = new IntersectionObserver(entries => {
            // Only trigger if: in view, has more pages, and not currently loading
            if (entries[0].isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
                loadMoreRef.current();
            }
        }, { threshold: 0.5 });

        observerRef.current.observe(node);
    }, [projects.length]); // Only recreate when list length changes

    // Add scroll to top button functionality
    useEffect(() => {
        const handleScroll = () => {
            // Show button when user scrolls down 500px
            setShowScrollTop(window.scrollY > 500);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (error) {
        return <div className="text-center py-10 text-red-500">Error loading projects: {error}</div>;
    }

    // Initial loading state (when no projects are loaded yet)
    if (isLoading && (!projects || projects.length === 0)) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(currentParams.limit || 9)
                    .fill(0)
                    .map((_, i) => (
                        <Skeleton key={i} className="h-[350px] rounded-xl bg-muted" />
                    ))}
            </div>
        );
    }

    // Empty state when no projects match filters
    if (!projects || projects.length === 0) {
        return (
            <div className="flex items-center justify-center">
                <EmptyState title="No projects found" description="Try adjusting your filters or search criteria." icons={[FileX2]} />
            </div>
        );
    }

    // Render projects with infinite scroll
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Map through loaded projects */}
                {projects.map((project, index) => {
                    // Check if this is the last project
                    const isLastProject = index === projects.length - 1;
                    
                    return (
                        <div 
                            key={project.id}
                            ref={isLastProject ? lastProjectElementRef : null}
                            className="project-card-container"
                        >
                            <Link
                                href={`/project/${project.id}`}
                                className="project-card group block rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <Image
                                        src={project.coverImage || "https://placehold.co/600x400?text=NO+IMAGE"}
                                        alt={project.title || "No title available"}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Display status badge if status exists */}
                                    {project.status && (
                                        <div className="absolute top-2 right-2 z-10">
                                            <Badge>{project.status}</Badge>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex flex-col h-[calc(100%-aspect-video)]">
                                    <h3 className="text-lg font-semibold mb-1 line-clamp-1">{project.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
                                        {project.subtitle || "No subtitle available."}
                                    </p>

                                    {/* Display Project Types */}
                                    {(project.projectTypes?.length > 0) && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {project.projectTypes.slice(0, 2).map((type: string, i: number) => (
                                                <Badge key={`${type}-${i}`} variant="outline" className="text-xs">
                                                    {type}
                                                </Badge>
                                            ))}
                                            {project.projectTypes.length > 2 && (
                                                <Badge variant="outline" className="text-xs">+{project.projectTypes.length - 2}</Badge>
                                            )}
                                        </div>
                                    )}

                                    {/* Display Domains and View Button */}
                                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/50">
                                        {(project.domains?.length > 0) ? (
                                            <div className="flex gap-1 flex-wrap">
                                                {project.domains.slice(0, 1).map((domain: string, i: number) => (
                                                    <Badge key={`${domain}-${i}`} variant="secondary" className="text-xs">
                                                        {domain}
                                                    </Badge>
                                                ))}
                                                {project.domains.length > 1 && (
                                                    <Badge variant="secondary" className="text-xs">+{project.domains.length - 1}</Badge>
                                                )}
                                            </div>
                                        ) : <div />}

                                        <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Loading indicator for infinite scroll */}
            {isLoading && projects.length > 0 && (
                <div className="flex justify-center py-4" ref={loadingRef}>
                    <div className="w-8 h-8 border-2 border-primary/50 border-t-primary rounded-full animate-spin"></div>
                </div>
            )}

            {/* Scroll to Top button */}
            {showScrollTop && (
                <button 
                    onClick={scrollToTop} 
                    className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-5 h-5 text-black" />
                </button>
            )}
        </div>
    );
}

/* Copyright (c) 2025, the contributors of the SDGP Connect project. All Rights Reserved.

This software is the joint property of the contributors to the SDGP Connect project.
Unauthorized distribution, commercial use, or reproduction of any part of this material
in any form is strictly prohibited without the explicit written consent of all contributors.
You may not alter or remove any copyright or attribution notice from this content. */

"use client"

import FilterSidebar from "@/components/projects/filter-sidebar";
import ProjectExplorer from "@/components/projects/project-explorer";
import SearchHeader from "@/components/projects/search-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectQueryParams, useProjects } from "@/hooks/project/useGetProjects";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

interface FilterState {
    featured: boolean;
    status: string[];
    years: string[];
    projectTypes: string[];
    domains: string[];
    sdgGoals: string[];
    techStack: string[];
}

function ProjectsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const currentParams = useMemo((): ProjectQueryParams => ({
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: parseInt(searchParams.get('limit') || '9', 10),
        title: searchParams.get('title') || undefined,
        featured: searchParams.get('featured') === 'true',
        status: searchParams.getAll('status'),
        years: searchParams.getAll('years'),
        projectTypes: searchParams.getAll('projectTypes'),
        domains: searchParams.getAll('domains'),
        sdgGoals: searchParams.getAll('sdgGoals'),
        techStack: searchParams.getAll('techStack'),
    }), [searchParams]);

    // Use the hook with added infinite scroll capabilities
    const { projects, isLoading, isInitialLoading, error, meta, hasMore, loadMore } = useProjects(currentParams);

    const initialFilters = useMemo((): FilterState => ({
        featured: currentParams.featured || false,
        status: currentParams.status || [],
        years: currentParams.years || [],
        projectTypes: currentParams.projectTypes || [],
        domains: currentParams.domains || [],
        sdgGoals: currentParams.sdgGoals || [],
        techStack: currentParams.techStack || [],
    }), [currentParams]);

    const toggleFilters = useCallback(() => {
        console.log('toggleFilters called, current state:', showMobileFilters);
        setShowMobileFilters(prev => {
            console.log('Setting showMobileFilters from', prev, 'to', !prev);
            return !prev;
        });
    }, [showMobileFilters]);

    const handleFilterChange = useCallback((newFilters: FilterState) => {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', String(currentParams.limit || 15));
        if (currentParams.title) params.append('title', currentParams.title);

        // Handle featured filter
        if (newFilters.featured) {
            params.append('featured', 'true');
        }

        // Handle array filters
        Object.entries(newFilters).forEach(([key, values]) => {
            // Skip featured as it's already handled above
            if (key === 'featured') return;
            
            if (Array.isArray(values) && values.length > 0) {
                values.forEach((value: string) => {
                    params.append(key, value);
                });
            }
        });

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
        
        // Close mobile filters after applying changes
        //setShowMobileFilters(false);
    }, [router, currentParams.limit, currentParams.title]);

    const handleSearch = useCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('title', value);
        } else {
            params.delete('title');
        }
        params.set('page', '1');
        router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    // Handle mobile filter close with escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showMobileFilters) {
                //setShowMobileFilters(false);
            }
        };

        if (showMobileFilters) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when mobile filters are open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [showMobileFilters]);

    console.log('Rendering with showMobileFilters:', showMobileFilters); // Debug log

    return (
        <div className="relative">
            <div className="container mx-auto py-8 px-4">
                <SearchHeader
                    toggleFilters={toggleFilters}
                    defaultTitle={currentParams.title ?? ""}
                    onSearch={handleSearch}
                />
                
                

                <div className="flex flex-col md:flex-row gap-6 mt-8">
                    {/* Desktop Filter Sidebar */}
                    <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
                        <div className="sticky top-0">
                            <FilterSidebar onFilterChange={handleFilterChange} initialFilters={initialFilters} />
                        </div>
                    </div>

                    <div className="flex-1">
                        <ProjectExplorer
                            currentParams={currentParams}
                            projects={projects || []}
                            isLoading={isLoading}
                            isInitialLoading={isInitialLoading}
                            error={error}
                            meta={meta}
                            hasMore={hasMore}
                            loadMore={loadMore}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            {showMobileFilters && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] md:hidden"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <div className="fixed inset-0 bg-background flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b bg-background shrink-0">
                            <h2 className="font-bold text-lg">Filters</h2>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => {
                                    console.log('Close button clicked');
                                    setShowMobileFilters(false);
                                }}
                                className="h-8 w-8 z-[10000]"
                                type="button"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        
                        {/* Filter Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <FilterSidebar 
                                onFilterChange={handleFilterChange} 
                                initialFilters={initialFilters} 
                            />
                        </div>
                        
                        {/* Action buttons */}
                        <div className="p-4 border-t bg-background shrink-0 flex gap-2">
                            <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => setShowMobileFilters(false)}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1"
                                onClick={() => setShowMobileFilters(false)}
                                type="button"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Wrap the client component in Suspense for loading fallback
const Page = () => {
    return (
        <Suspense fallback={<SimpleSkeleton />}>
            <ProjectsPageContent />
        </Suspense>
    );
};

// Define a simple skeleton component for the fallback (reduced to prevent double-skeleton effect)
const SimpleSkeleton = () => (
    <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-full mb-8" />
        <div className="flex flex-col md:flex-row gap-6 mt-8">
            <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
                <Skeleton className="h-32 w-full" />
            </div>
            <div className="flex-1">
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
    </div>
);

// Keep LoadingSkeleton for other uses if needed
const LoadingSkeleton = () => (
    <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-full mb-8" />
        <div className="flex flex-col md:flex-row gap-6 mt-8">
            <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
                <Skeleton className="h-64 w-full" />
            </div>
            <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6)
                        .fill(0)
                        .map((_, i) => (
                            <Skeleton key={i} className="h-[350px] rounded-xl" />
                        ))}
                </div>
            </div>
        </div>
    </div>
);

export default Page;
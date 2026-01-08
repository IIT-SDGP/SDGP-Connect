// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SearchHeaderProps {
    toggleFilters: () => void; // Made required (removed ?)
    defaultTitle?: string;
    onSearch: (value: string) => void;
}

export default function SearchHeader({
    toggleFilters,
    defaultTitle = "",
    onSearch
}: SearchHeaderProps) {
    const [value, setValue] = useState(defaultTitle);

    // keep local state in sync if defaultTitle ever changes
    useEffect(() => {
        setValue(defaultTitle);
    }, [defaultTitle]);

    // debounce: wait 300ms after the user stops typing
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(value);
        }, 300);
        return () => clearTimeout(handler);
    }, [value, onSearch]);

    const handleFilterToggle = () => {
        console.log('Filter button clicked!'); // Debug log
        if (toggleFilters) {
            toggleFilters();
        } else {
            console.error('toggleFilters function is not provided!');
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Projects</h1>
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects by title..."
                        className="pl-10"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <Button
                    variant="outline"
                    className="md:hidden flex-shrink-0 touch-manipulation"
                    onClick={() => {
                        console.log('SearchHeader filter button clicked!');
                        if (toggleFilters) {
                            toggleFilters();
                        } else {
                            console.error('toggleFilters is not provided!');
                        }
                    }}
                    type="button"
                >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </div>
        </div>
    );
}
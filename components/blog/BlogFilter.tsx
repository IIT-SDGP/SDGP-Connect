// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client";

import { Badge } from "@/components/ui/badge";
import { getAllCategories } from "@/lib/blog-utils";

interface BlogFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function BlogFilter({ activeCategory, onCategoryChange }: BlogFilterProps) {
  const categories = getAllCategories();

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((category) => (
        <Badge
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          className="cursor-pointer px-4 py-2 transition-all duration-200 hover:scale-105"
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}

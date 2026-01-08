// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import React from 'react';
import { IProjectAssociation } from "@/types/project/type";
import { techStackOptions } from "@/lib/types/mapping";
import { Button } from './ui/button';

interface TechCardProps {
  techStacks: IProjectAssociation[];
}

const TechCard: React.FC<TechCardProps> = ({ techStacks }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {techStacks.length > 0 ? (
        techStacks.map((tech) => {
          // Find the matching tech stack from the mapping
          const techStack = techStackOptions.find(stack => stack.value === tech.techStack);
          
          if (!techStack) return null; // Skip if no matching tech found
          
          // Use the Icon component from the mapping
          const IconComponent = techStack.icon;
          
          return (
            <Button 
              key={tech.id} 
              className="cursor-pointer text-zinc-200 flex gap-2 items-center bg-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#111] transition-all ease-in duration-200"
            >
              <IconComponent className="w-5 h-5" />
              {techStack.label}
            </Button>
          );
        })
      ) : (
        <div className="text-center py-2 w-full">No technology stack associated with this project</div>
      )}
    </div>
  );
}

export default TechCard;

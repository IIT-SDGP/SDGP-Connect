// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { IProjectAssociation } from "@/types/project/type";
import React from "react";
import { Card } from "../ui/card";
import { sdgGoals, projectTypeOptions } from "@/lib/types/mapping";
import { AssociationType } from "@/types/prisma-types";
import ProjectTypeCard from "../project-type-card";
import TechCard from "../techcard";
import { Badge } from "../ui/badge";
import { Blocks, Globe, Leaf, Layers } from "lucide-react";

interface SDGSectionProps {
  associations: IProjectAssociation[];
}

export const ProjectAssociation: React.FC<SDGSectionProps> = ({
  associations,
}) => {
  const sdgAssociations = associations.filter(
    (assoc) => assoc.type === AssociationType.PROJECT_SDG
  );

  const domainAssociations = associations.filter(
    (assoc) => assoc.type === AssociationType.PROJECT_DOMAIN
  );

  const typeAssociations = associations.filter(
    (assoc) => assoc.type === AssociationType.PROJECT_TYPE
  );

  const techStackAssociations = associations.filter(
    (assoc) => assoc.type === AssociationType.PROJECT_TECH
  );

const validSdgAssociations = sdgAssociations.filter((association) =>
  sdgGoals.some((goal) => goal.name === association.sdgGoal)
);

return (
  <Card className="relative overflow-hidden p-6 md:p-8 border shadow-sm">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(56,189,248,0.12),transparent_36%)]" />
    <div className="flex items-center justify-between gap-3 mb-6">
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Classification</p>
        <h2 className="text-2xl md:text-3xl font-semibold mt-1">Project Focus Areas</h2>
      </div>
      <Badge variant="outline" className="px-3 py-1">
        {associations.length} tags
      </Badge>
    </div>

    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold mb-3 inline-flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Sustainable Development Goals
        </h3>
        {validSdgAssociations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {validSdgAssociations.map((association) => {
              const sdgGoal = sdgGoals.find((goal) => goal.name === association.sdgGoal);
              if (!sdgGoal) return null;

              return (
                <div
                  key={association.id}
                  className="flex items-start gap-3 rounded-xl border bg-muted/25 px-3 py-3 transition hover:bg-muted/40"
                >
                  <img src={sdgGoal.icon} alt={sdgGoal.name} className="h-12 w-12 rounded-md object-contain bg-background p-1" />
                  <div>
                    <p className="text-sm font-medium">{sdgGoal.name.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{sdgGoal.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-4">
            No SDG goals are tagged for this project yet.
          </p>
        )}
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3 inline-flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Project Domains
        </h3>
        <div className="flex flex-wrap gap-2">
          {domainAssociations.length > 0 ? (
            domainAssociations.map((domain) => (
              <Badge key={domain.id} className="rounded-full px-3 py-1 text-xs shadow-sm">
                {domain.domain?.replace(/_/g, " ")}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-4 w-full">
              No domains associated with this project.
            </p>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 inline-flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Project Type
          </h3>
          <div className="rounded-xl border bg-muted/20 p-3 min-h-[80px]">
            {typeAssociations.length > 0 ? (
              <ProjectTypeCard
                projectTypes={projectTypeOptions.filter((type) =>
                  typeAssociations.some((assoc) => assoc.projectType === type.value)
                )}
              />
            ) : (
              <p className="text-sm text-muted-foreground">No project types associated with this project.</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 inline-flex items-center gap-2">
            <Blocks className="h-5 w-5 text-primary" />
            Tech Stack
          </h3>
          <div className="rounded-xl border bg-muted/20 p-3 min-h-[80px]">
            {techStackAssociations.length > 0 ? (
              <TechCard techStacks={techStackAssociations} />
            ) : (
              <p className="text-sm text-muted-foreground">No technologies associated with this project.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  </Card>
  );
};

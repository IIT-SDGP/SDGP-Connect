// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client"

import { useState } from "react"
import AddMemberDialog from "@/components/team/add-member-dialog"
import TeamMemberCard from "@/components/team/team-member-card"
import TeamMemberRow from "@/components/team/team-member-row"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, GridIcon, ListIcon } from "lucide-react"
import { AdminPageShell } from "@/components/layout/admin-page-shell"
import { cn } from "@/lib/utils"

interface TeamMember {
  id: string
  name: string
  designation: string
  linkedIn: string
  image: string
}

// Mock data - in a real app, this would come from a database
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Jane Smith",
    designation: "CEO",
    linkedIn: "https://linkedin.com/in/janesmith",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "2",
    name: "John Doe",
    designation: "CTO",
    linkedIn: "https://linkedin.com/in/johndoe",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    designation: "Lead Designer",
    linkedIn: "https://linkedin.com/in/sarahjohnson",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "4",
    name: "Michael Brown",
    designation: "Senior Developer",
    linkedIn: "https://linkedin.com/in/michaelbrown",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "5",
    name: "Emily Davis",
    designation: "Product Manager",
    linkedIn: "https://linkedin.com/in/emilydavis",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "6",
    name: "David Wilson",
    designation: "UX Designer",
    linkedIn: "https://linkedin.com/in/davidwilson",
    image: "/placeholder.svg?height=300&width=300",
  },
]

export default function TeamPage() {
  const [view, setView] = useState<"grid" | "list">("grid")

  return (
    <AdminPageShell
      title="Team Management"
      description="Manage your module team members and profile cards."
      actions={
        <AddMemberDialog>
          <Button className="gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Member
          </Button>
        </AddMemberDialog>
      }
    >
      <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")} className="space-y-6">
        <TabsList className="admin-tab-list h-11 w-fit">
          <TabsTrigger value="grid" className="admin-tab-trigger gap-2 px-4">
            <GridIcon className="h-4 w-4" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="list" className="admin-tab-trigger gap-2 px-4">
            <ListIcon className="h-4 w-4" />
            List
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className={cn("admin-content-card", view !== "grid" && "hidden")}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      <div className={cn(view !== "list" && "hidden")}>
        <div className="admin-table-wrap">
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] border-b border-border/60 bg-muted/35 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <div>Name</div>
            <div>Designation</div>
            <div>LinkedIn</div>
            <div className="text-center">
              <span className="sr-only">Actions</span>
            </div>
          </div>
          <div className="divide-y divide-border/60">
            {teamMembers.map((member) => (
              <TeamMemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
    </AdminPageShell>
  )
}

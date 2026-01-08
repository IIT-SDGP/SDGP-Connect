// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

"use client"

import AddMemberDialog from "@/components/team/add-member-dialog"
import { TeamFilter } from "@/components/team/team-filter"
import TeamMemberCard from "@/components/team/team-member-card"
import TeamMemberRow from "@/components/team/team-member-row"
import { Button } from "@/components/ui/button"
import { PlusIcon, GridIcon, ListIcon } from "lucide-react"

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
  return (
    <div className="container  space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <AddMemberDialog>
          <Button className="gap-2 rounded-full">
            <PlusIcon className="h-5 w-5" />
            Add Member
          </Button>
        </AddMemberDialog>
      </div>

      <ViewToggle />

      <div id="grid-view">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      <div id="list-view" className="hidden">
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] p-4 bg-muted/50 font-medium">
            <div>Name</div>
            <div>Designation</div>
            <div>LinkedIn</div>
            <div></div>
          </div>
          <div className="divide-y">
            {teamMembers.map((member) => (
              <TeamMemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ViewToggle() {
  return (
    <div className="flex items-center justify-between">
   

      <div className="flex items-center space-x-2">
        <div className="bg-muted rounded-full p-1 flex">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full view-toggle data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-state="active"
            onClick={() => {
              document.getElementById("grid-view")?.classList.remove("hidden")
              document.getElementById("list-view")?.classList.add("hidden")
              // Toggle active state
              document.querySelectorAll(".view-toggle").forEach((btn) => btn.setAttribute("data-state", "inactive"))
              document.getElementById("grid-btn")?.setAttribute("data-state", "active")
            }}
            id="grid-btn"
          >
            <GridIcon className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full view-toggle data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-state="inactive"
            onClick={() => {
              document.getElementById("list-view")?.classList.remove("hidden")
              document.getElementById("grid-view")?.classList.add("hidden")
              // Toggle active state
              document.querySelectorAll(".view-toggle").forEach((btn) => btn.setAttribute("data-state", "inactive"))
              document.getElementById("list-btn")?.setAttribute("data-state", "active")
            }}
            id="list-btn"
          >
            <ListIcon className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

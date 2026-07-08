"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LinkedinIcon, MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import EditMemberDialog from "./edit-member-dialog"
import DeleteMemberDialog from "./delete-member-dialog"

interface TeamMember {
  id: string
  name: string
  designation: string
  linkedIn: string
  image: string
}

interface TeamMemberRowProps {
  member: TeamMember
}

export default function TeamMemberRow({ member }: TeamMemberRowProps) {
  const initials = member.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.image} alt={member.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{member.name}</span>
      </div>
      <div>{member.designation}</div>
      <div>
        <Link href={member.linkedIn} target="_blank" rel="noopener noreferrer">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-full hover:bg-primary hover:text-primary-foreground"
          >
            <LinkedinIcon className="h-4 w-4" />
            Connect
          </Button>
        </Link>
      </div>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditMemberDialog member={member}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </EditMemberDialog>

            <DeleteMemberDialog memberId={member.id} memberName={member.name}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:text-destructive"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DeleteMemberDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

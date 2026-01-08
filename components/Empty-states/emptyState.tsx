// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { EmptyState } from "@/components/ui/empty-state"
import { 
  FileText, 
  Link, 
  Files, 
  Search, 
  MessageSquare, 
  Mail, 
  Image,
  FileQuestion,
  Settings,
  Trophy
} from "lucide-react"

function EmptyStateDefault() {
  return (
    <EmptyState
      title="No Forms Created"
      description="You can create a new template to add in your pages."
      icons={[FileText, Link, Files]}
      action={{
        label: "Create Form",
        onClick: () => console.log("Create form clicked")
      }}
    />
  )
}

function EmptyStateMessages() {
  return (
    <EmptyState
      title="No Messages"
      description="Start a conversation by sending a message."
      icons={[MessageSquare, Mail]}
      action={{
        label: "Send Message",
        onClick: () => console.log("Send message clicked")
      }}
    />
  )
}

function EmptyStateSearch() {
  return (
    <EmptyState
      title="No Results Found"
      description="Try adjusting your search filters."
      icons={[Search, FileQuestion]}
    />
  )
}

function EmptyStateMedia() {
  return (
    <EmptyState
      title="No Images"
      description="Upload images to get started with your gallery."
      icons={[Image]}
      action={{
        label: "Upload Images",
        onClick: () => console.log("Upload clicked")
      }}
    />
  )
}
function NoMedia() {
  return (
    <EmptyState
      title="No Images Found"
      description="This Project does not have any Featured Images"
      icons={[Image]}
      className="bg-muted/50"
      
    />
  )
}
function EmptyStateSettings() {
  return (
    <EmptyState
      title="No Settings"
      description="Configure your application settings to get started."
      icons={[Settings]}
      action={{
        label: "Configure",
        onClick: () => console.log("Configure clicked")
      }}
    />
  )
}
function EmptyStateWinners() {
  return (
    <EmptyState
      title="No Winners Yet"
      description="No participants or winning projects have been recorded for this competition yet."
      icons={[Trophy]}
      className="bg-muted/50"
    />
  )
}

export {
  EmptyStateDefault,
  EmptyStateMessages,
  EmptyStateSearch,
  EmptyStateMedia,
  EmptyStateSettings,
  NoMedia,
  EmptyStateWinners
}
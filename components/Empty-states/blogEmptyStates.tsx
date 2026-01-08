// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { EmptyState } from "@/components/ui/empty-state"
import { 
  BookOpen, 
  PenTool, 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search
} from "lucide-react"

export function EmptyPendingBlogs() {
  return (
    <EmptyState
      title="No Pending Blog Posts"
      description="There are currently no blog posts waiting for review. New submissions will appear here."
      icons={[BookOpen, Clock, FileText]}
    />
  )
}

export function EmptyApprovedBlogs() {
  return (
    <EmptyState
      title="No Approved Blog Posts"
      description="No blog posts have been approved yet. Approved posts will be visible to users on the public blog."
      icons={[BookOpen, CheckCircle, FileText]}
    />
  )
}

export function EmptyRejectedBlogs() {
  return (
    <EmptyState
      title="No Rejected Blog Posts"
      description="No blog posts have been rejected. Posts that don't meet the guidelines will appear here."
      icons={[BookOpen, XCircle, FileText]}
    />
  )
}

export function EmptyBlogSearch() {
  return (
    <EmptyState
      title="No Results Found"
      description="We couldn't find any blog posts matching your search criteria. Try adjusting your search terms."
      icons={[Search, BookOpen, FileText]}
    />
  )
}

export function EmptyBlogsList() {
  return (
    <EmptyState
      title="No Blog Posts Available"
      description="There are currently no blog posts in the system. Authors can submit their posts for review."
      icons={[BookOpen, PenTool, FileText]}
    />
  )
}

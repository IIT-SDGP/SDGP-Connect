// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function BlogPostSkeleton() {
  return (
    <section className="py-16 flex justify-center items-center">
      <div className="container animate-pulse">
        <div className="relative mb-12 h-[600px] overflow-hidden bg-muted rounded-lg" />
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8 lg:col-span-9">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              <div className="h-8 w-3/4 bg-muted rounded mb-4" />
              <div className="h-6 w-1/2 bg-muted rounded mb-2" />
              <div className="h-6 w-full bg-muted rounded mb-2" />
              <div className="h-6 w-5/6 bg-muted rounded mb-2" />
              <div className="h-6 w-2/3 bg-muted rounded mb-2" />
            </article>
          </div>
          <aside className="md:col-span-4 lg:col-span-3 space-y-6">
            <Card>
              <CardContent className="py-6">
                <div className="h-4 w-1/2 bg-muted rounded mb-4" />
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-muted rounded-full" />
                  <div className="h-8 w-8 bg-muted rounded-full" />
                  <div className="h-8 w-8 bg-muted rounded-full" />
                  <div className="h-8 w-8 bg-muted rounded-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6 flex items-center space-x-4">
                <Avatar className="size-10 bg-muted" />
                <div>
                  <div className="h-4 w-24 bg-muted rounded mb-2" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6">
                <div className="h-4 w-1/2 bg-muted rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-3 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-2/3 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
}

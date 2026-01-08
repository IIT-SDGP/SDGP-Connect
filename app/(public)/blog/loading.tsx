// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="h-16 bg-muted rounded-lg animate-pulse mb-6 mx-auto max-w-md"></div>
            <div className="h-6 bg-muted rounded-lg animate-pulse mb-8 mx-auto max-w-2xl"></div>
            <div className="h-12 bg-muted rounded-lg animate-pulse mx-auto max-w-md"></div>
          </div>
        </div>
      </section>

      {/* Filter Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-muted rounded-full animate-pulse"></div>
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border p-6 shadow-sm">
                <div className="aspect-video bg-muted rounded-lg animate-pulse mb-4"></div>
                <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-6 bg-muted rounded animate-pulse mb-3"></div>
                <div className="h-4 bg-muted rounded animate-pulse mb-4 w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                  <div className="h-6 w-20 bg-muted rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

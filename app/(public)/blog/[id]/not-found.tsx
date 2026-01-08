// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Icon */}
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
            <FileQuestion className="w-12 h-12 text-muted-foreground" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Blog Post Not Found
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been removed. 
            Please check the URL or browse our other articles.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog">
              <Button size="lg" className="w-full sm:w-auto">
                <ArrowLeft size={16} className="mr-2" />
                Back to Blog
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Home size={16} className="mr-2" />
                Go Home
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Looking for something specific?</h3>
            <p className="text-muted-foreground">
              Use our search feature or browse by categories to find the content you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

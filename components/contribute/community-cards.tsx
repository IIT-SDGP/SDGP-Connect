// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function CommunityCards({ cardVariants }: { cardVariants: any }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-center mb-8">Join Our Community</h2>
      <p className="text-center text-white/70 mb-8 max-w-2xl mx-auto">
        Connect with fellow developers, get support, and collaborate on exciting projects.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Join Our Community</CardTitle>
              <CardDescription className="text-white/60">Help us on other aspects of the project.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">Connect with us on WhatsApp to discuss ideas, get support, and collaborate.</p>
              <Button asChild variant="outline" className="bg-white/[0.05] text-white border-white/[0.1] hover:bg-white/[0.1]">
                <a href="https://chat.whatsapp.com/IFJH9D1sbiT7OsNsBT4neT" target="_blank" rel="noopener noreferrer">
                  Join WhatsApp Community <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="h-full">
          <Card className="h-full bg-white/[0.05] backdrop-blur-lg border border-white/[0.15] shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-xl">Explore Our Code</CardTitle>
              <CardDescription className="text-white/60">Dive into the codebase and see how you can contribute.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
              <p className="text-white/70 mb-4">Access the full project repository on GitHub for detailed documentation and code.</p>
              <Button asChild variant="outline" className="bg-white/[0.05] text-white border-white/[0.1] hover:bg-white/[0.1]">
                <a href="https://github.com/agzaiyenth/sdgp-connect" target="_blank" rel="noopener noreferrer">
                  Visit GitHub Repository <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}

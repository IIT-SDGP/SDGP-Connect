// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { cn } from '@/lib/utils';
import useIsMobile from '@/hooks/useIsMobile';
import { Laptop } from 'lucide-react';
import Footer from '../Footer';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Show mobile message if on mobile device
  if (isMobile) {
    return (
      <div className="min-h-full bg-background">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-col min-h-screen items-center justify-center  px-4 text-center pt-16">
          <Laptop className="h-16 w-16 mb-4 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight mb-2">Desktop View Required</h2>
          <p className="text-muted-foreground mb-4">
            The admin dashboard is optimized for larger screens. Please open this page on a laptop or desktop computer for the best experience.
          </p>
          <div className="p-4 bg-muted rounded-lg max-w-md">
            <p className="text-sm">
              If you need immediate access on mobile, you can request the desktop site in your browser settings, but functionality may be limited.
            </p>
          </div>
        </div>
        <Footer />  
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex  pt-16">
        <Sidebar isOpen={sidebarOpen} />
        <main
          className={cn(
            'flex-1 overflow-y-auto p-6 transition-all min-h-screen duration-300 ease-in-out',
            sidebarOpen ? 'ml-64' : 'ml-20'
          )}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
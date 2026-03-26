'use client';

import { useEffect, useState } from 'react';
import { Navbar } from './navbar';
import { StudentSidebar } from './student-sidebar';
import { cn } from '@/lib/utils';
import useIsMobile from '@/hooks/useIsMobile';
import { Laptop } from 'lucide-react';
import Footer from '../Footer';

export function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
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

  // Mobile fallback UI
  if (isMobile) {
    return (
      <div className="min-h-full bg-background">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-col min-h-screen items-center justify-center  px-4 text-center pt-16">
          <Laptop className="h-16 w-16 mb-4 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight mb-2">Desktop View Required</h2>
          <p className="text-muted-foreground mb-4">
            The student dashboard is optimized for larger screens. Please open this page on a laptop or desktop computer for the best experience.
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
        <StudentSidebar isOpen={sidebarOpen} />
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


// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { cn } from '@/lib/utils';
import useIsMobile from '@/hooks/useIsMobile';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const desktopSidebarWidth = isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60';

  useEffect(() => {
    const saved = window.localStorage.getItem('admin-sidebar-collapsed');
    if (saved) {
      setIsSidebarCollapsed(saved === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen((prev) => !prev);
      return;
    }
    setIsSidebarCollapsed((prev) => {
      const nextValue = !prev;
      window.localStorage.setItem('admin-sidebar-collapsed', String(nextValue));
      return nextValue;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
      <div className="flex pt-16">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onToggleCollapse={toggleSidebar}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
        <main
          className={cn(
            'min-h-[calc(100vh-4rem)] flex-1 overflow-y-auto p-4 pb-10 transition-[margin-left] duration-300 ease-in-out sm:p-6 sm:pb-12',
            desktopSidebarWidth
          )}
        >
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
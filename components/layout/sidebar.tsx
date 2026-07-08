// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Trophy,
  BookOpen,
  Mail,
  ChevronsLeft,
  ChevronsRight,
  Medal,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Project Overview',
    href: '/admin/projects',
    icon: FolderKanban,
  },
  {
    title: 'Edit Requests',
    href: '/admin/edit-requests',
    icon: FolderKanban,
  },
  {
    title: 'Blog Management',
    href: '/admin/blogs',
    icon: BookOpen,
  },
  {
    title: 'Competitions',
    href: '/admin/competitions',
    icon: Medal,
  },
  {
    title: 'Awards',
    href: '/admin/awards',
    icon: Trophy,
  },
  {
    title: 'Email Outbox',
    href: '/admin/email',
    icon: Mail,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export function Sidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const sidebarWidthClass = isCollapsed ? 'w-16' : 'w-60';

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 transform-gpu border-r border-sidebar-border bg-sidebar/95 text-sidebar-foreground backdrop-blur-md will-change-[width] transition-[width] duration-300 ease-in-out lg:translate-x-0',
          sidebarWidthClass,
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-start border-b border-sidebar-border px-3">
          <div className="flex w-full items-center justify-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sidebar-primary/10 ring-1 ring-sidebar-primary/20">
              <Image
                src="/icon.svg"
                alt="SDGP logo"
                width={22}
                height={22}
                className="block dark:hidden"
                priority
              />
              <Image
                src="/iconw.svg"
                alt="SDGP logo"
                width={22}
                height={22}
                className="hidden dark:block"
                priority
              />
            </div>
            <div
              className={cn(
                'overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out',
                isCollapsed ? 'ml-0 max-w-0 opacity-0' : 'ml-3 max-w-[180px] opacity-100'
              )}
            >
              <p className="truncate text-sm font-semibold leading-none">SDGP Connect</p>
              <p className="truncate pt-1 text-xs text-sidebar-foreground/70">Admin Workspace</p>
            </div>
          </div>
        </div>
        <div className="flex h-[calc(100%-4rem)] flex-col py-4">
          <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'group relative flex items-center justify-start overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-[color,background-color,transform] duration-200 ease-out',
                  'before:pointer-events-none before:absolute before:left-0 before:top-1/2 before:h-9 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-sidebar-primary before:opacity-0 before:transition-opacity before:duration-200',
                  'focus-visible:ring-2 focus-visible:ring-sidebar-ring/55 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar',
                  isActive
                    ? 'bg-sidebar-primary/[0.14] font-semibold text-sidebar-primary before:opacity-100 shadow-sm shadow-sidebar-primary/5 dark:bg-sidebar-primary/[0.18] dark:shadow-sidebar-primary/10'
                    : 'text-sidebar-foreground/80 active:scale-[0.99] hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground hover:before:opacity-50 dark:hover:bg-sidebar-accent/45'
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <span
                  className={cn(
                    'inline-flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-200 -translate-x-0.5',
                    isActive
                      ? 'text-sidebar-primary'
                      : 'text-sidebar-foreground/65 group-hover:text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]" />
                </span>
                <span
                  className={cn(
                    'overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out',
                    isCollapsed ? 'ml-0 max-w-0 opacity-0' : 'ml-3 max-w-[190px] opacity-100'
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
          </nav>
          <div className="mt-auto border-t border-sidebar-border px-3 pt-3">
            <Button
              variant="ghost"
              className="hidden w-full justify-start rounded-xl px-3 text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground active:scale-[0.99] dark:hover:bg-sidebar-accent/45 lg:flex"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center -translate-x-0.5" aria-hidden>
                {isCollapsed ? (
                  <ChevronsRight className="h-4 w-4" strokeWidth={2.25} />
                ) : (
                  <ChevronsLeft className="h-4 w-4" strokeWidth={2.25} />
                )}
              </span>
              <span
                className={cn(
                  'overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out',
                  isCollapsed ? 'ml-0 max-w-0 opacity-0' : 'ml-3 max-w-[140px] opacity-100'
                )}
              >
                Collapse Sidebar
              </span>
            </Button>
          </div>
        </div>
      </aside>
      {isMobileOpen ? (
        <button
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
        />
      ) : null}
    </>
  );
}
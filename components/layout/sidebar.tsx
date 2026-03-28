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
  Users2,
  BookOpen,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    title: 'Blog Management',
    href: '/admin/blogs',
    icon: BookOpen,
  },
  {
    title: 'Competitions',
    href: '/admin/competitions',
    icon: FolderKanban, // You may want to use a different icon
  },
  {
    title: 'Awards',
    href: '/admin/awards',
    icon: FolderKanban, // You may want to use a trophy icon
  },
  {
    title: 'Email Outbox',
    href: '/admin/email',
    icon: Mail,
  },
  // {
  //   title: 'Module Team',
  //   href: '/admin/team',
  //   icon: Users2,
  // },
];

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 z-40 h-full border-r bg-background transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto pt-20">
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5', !isOpen && 'mx-auto')} />
                {isOpen && <span className="ml-3">{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

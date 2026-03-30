'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard } from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/student',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    href: '/student/projects',
    icon: LayoutDashboard,
  },
];

interface StudentSidebarProps {
  isOpen: boolean;
}

export function StudentSidebar({ isOpen }: StudentSidebarProps) {
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
// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import { useEffect, useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onMenuClick: () => void; // opens on mobile, collapses on desktop
  isSidebarCollapsed: boolean;
}

function formatNavDate(d: Date) {
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatNavTime(d: Date) {
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function Navbar({ onMenuClick, isSidebarCollapsed }: NavbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [clock, setClock] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const tick = () => setClock(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [mounted]);

  const userName = session?.user?.name ?? 'User';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname === '/admin/users') return 'User Management';
    if (pathname === '/admin/projects') return 'Project Management';
    if (pathname === '/admin/blogs') return 'Blog Management';
    if (pathname === '/admin/competitions') return 'Competition Management';
    if (pathname === '/admin/awards') return 'Awards Management';
    if (pathname === '/admin/email') return 'Email Outbox';
    if (pathname === '/admin/team') return 'Team Management';

    const lastSegment = pathname.split('/').filter(Boolean).pop();
    if (!lastSegment) return 'Admin';
    return lastSegment
      .split('-')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  };

  return (
    <nav
      className={
        isSidebarCollapsed
          ? 'fixed top-0 z-50 w-full border-b border-border/70 bg-background/78 backdrop-blur-xl transition-[left,width] duration-300 ease-in-out lg:left-16 lg:w-[calc(100%-4rem)]'
          : 'fixed top-0 z-50 w-full border-b border-border/70 bg-background/78 backdrop-blur-xl transition-[left,width] duration-300 ease-in-out lg:left-60 lg:w-[calc(100%-15rem)]'
      }
    >
      <div className="flex h-16 w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            className={cn(
              'shrink-0 rounded-xl lg:hidden',
              'text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-600',
              'dark:text-indigo-400 dark:hover:text-indigo-300'
            )}
          >
            <Menu className="h-6 w-6" strokeWidth={2.25} />
          </Button>

          <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {getPageTitle()}
          </h1>
        </div>

        {mounted && clock ? (
          <div
            className="flex max-w-[38%] shrink-0 flex-col items-center border-x border-border/60 px-1.5 text-center sm:max-w-none sm:px-3 md:px-5"
            suppressHydrationWarning
          >
            <time
              className="line-clamp-2 text-[9px] leading-tight text-muted-foreground sm:line-clamp-none sm:text-xs"
              dateTime={clock.toISOString()}
            >
              {formatNavDate(clock)}
            </time>
            <span
              className="tabular-nums text-[10px] font-semibold text-foreground sm:text-sm"
              suppressHydrationWarning
            >
              {formatNavTime(clock)}
            </span>
          </div>
        ) : null}

        <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className={cn(
              'rounded-xl',
              'text-amber-500 hover:bg-amber-500/10 hover:text-amber-600',
              'dark:text-amber-400 dark:hover:text-amber-300'
            )}
          >
            <Bell className="h-6 w-6" strokeWidth={2.25} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'flex items-center space-x-2 rounded-full px-2 py-1',
                  'ring-2 ring-transparent transition-all hover:bg-violet-500/10 hover:ring-violet-400/35'
                )}
              >
                <Avatar className="ring-2 ring-violet-400/40 ring-offset-2 ring-offset-background">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-violet-500/15 text-violet-700 dark:text-violet-200">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-foreground md:inline">
                  {userName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  signOut({
                    callbackUrl: '/login',
                  })
                }
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

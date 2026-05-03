// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Role } from '@/types/prisma-types';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { setTheme } = useTheme();
  const { data: session } = useSession();

  const userName = session?.user?.name ?? 'User';
  const userRole = (session?.user as any)?.role as Role | undefined;
  const dashboardTitle = userRole === Role.STUDENT ? 'Student Dashboard' : 'Admin Dashboard';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </Button>

        <div className="ml-4 flex items-center space-x-4">
          <h1 className="text-xl font-bold text-primary">{dashboardTitle}</h1>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {/* Theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-6 w-6" />
          </Button>

          {/* User menu with name and logout */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 rounded-full px-2 py-1"
              >
                <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-zinc-200">
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

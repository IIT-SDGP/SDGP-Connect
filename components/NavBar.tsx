// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import { sidebarItems } from '@/data/NavBarItems';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function DockThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const active = theme === 'system' ? resolvedTheme : theme;
  const isDark = active === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        'relative h-11 w-11 shrink-0 rounded-xl touch-manipulation md:h-12 md:w-12',
        'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
      )}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={mounted ? `Use ${isDark ? 'light' : 'dark'} mode` : 'Theme'}
      disabled={!mounted}
    >
      {!mounted ? (
        <span className="h-5 w-5 md:h-6 md:w-6" aria-hidden />
      ) : isDark ? (
        <Sun className="h-5 w-5 md:h-6 md:w-6" aria-hidden />
      ) : (
        <Moon className="h-5 w-5 md:h-6 md:w-6" aria-hidden />
      )}
    </Button>
  );
}

export function NavBar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed z-50',
        // Mobile: bottom center with proper width
        'bottom-4 left-1/2 w-[95%] max-w-md -translate-x-1/2 transform',
        // Desktop: left side, vertically centered
        'md:left-4 md:top-1/2 md:w-auto md:max-w-none md:-translate-y-1/2 md:translate-x-0'
      )}
    >
      <nav
        className={cn(
          'flex items-center gap-2 rounded-2xl border bg-background/80 p-3 shadow-lg backdrop-blur-lg',
          // Mobile: horizontal layout with even distribution
          'justify-between md:justify-start',
          // Desktop: vertical layout
          'md:flex-col md:gap-3 md:p-4'
        )}
      >
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex-shrink-0 rounded-xl p-2 transition-all duration-200 hover:bg-primary/10',
                isActive && 'bg-primary/10',
                // Ensure consistent sizing on mobile
                'flex min-w-[44px] items-center justify-center'
              )}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={0}
            >
              {/* Visually hidden text for screen readers */}
              <span className="sr-only">{item.label}</span>
              <Icon
                aria-label={item.label}
                className={cn(
                  'h-5 w-5 transition-colors md:h-6 md:w-6',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              {/* Tooltip - hidden on mobile, visible on desktop hover */}
              <span
                className={cn(
                  'absolute rounded-md bg-popover px-2 py-1 text-sm text-popover-foreground',
                  'invisible opacity-0 transition-all duration-200',
                  // Mobile: hide tooltips
                  'hidden md:block',
                  // Desktop: show on hover, positioned to the right
                  'md:left-full md:ml-2 md:translate-x-2',
                  'md:group-hover:visible md:group-hover:translate-x-0 md:group-hover:opacity-100'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        <div
          className={cn(
            'flex w-full justify-center border-border/60 md:w-auto md:border-t md:pt-2',
            'border-t pt-2 md:mt-0'
          )}
          role="presentation"
        >
          <DockThemeToggle />
        </div>
      </nav>
    </aside>
  );
}

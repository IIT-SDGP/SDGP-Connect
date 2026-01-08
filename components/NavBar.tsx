// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';
import { sidebarItems } from '@/data/NavBarItems';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed z-50',
        // Mobile: bottom center with proper width
        'bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-md',
        // Desktop: left side, vertically centered
        'md:left-4 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:w-auto md:max-w-none'
      )}
    >
      <nav
        className={cn(
          'flex items-center gap-2 p-3 rounded-2xl backdrop-blur-lg bg-background/80 border shadow-lg',
          // Mobile: horizontal layout with even distribution
          'justify-between md:justify-start',
          // Desktop: vertical layout
          'md:flex-col md:gap-4 md:p-4'
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
                'p-2 rounded-xl transition-all duration-200 hover:bg-primary/10 relative group flex-shrink-0',
                isActive && 'bg-primary/10',
                // Ensure consistent sizing on mobile
                'min-w-[44px] flex items-center justify-center'
              )}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={0}
            >
              {/* Visually hidden text for screen readers */}
              <span className="sr-only">{item.label}</span>
              <Icon
                aria-label={item.label}
                className={cn(
                  'w-5 h-5 md:w-6 md:h-6 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              {/* Tooltip - hidden on mobile, visible on desktop hover */}
              <span className={cn(
                'absolute px-2 py-1 rounded-md bg-popover text-popover-foreground text-sm',
                'invisible opacity-0 transition-all duration-200',
                // Mobile: hide tooltips
                'hidden md:block',
                // Desktop: show on hover, positioned to the right
                'md:left-full md:ml-2 md:translate-x-2',
                'md:group-hover:visible md:group-hover:opacity-100 md:group-hover:translate-x-0'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Theme toggle - commented out but keeping the structure */}
        {/* <div className="mt-2 border-t pt-4 w-full justify-center md:justify-start md:block hidden">
          <ThemeToggle />
        </div> */}
      </nav>
    </aside>
  );
}
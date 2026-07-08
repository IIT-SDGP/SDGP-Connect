// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import { sidebarItems } from '@/data/NavBarItems';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHomeScrollChromeVisible } from '@/hooks/HomeScrollChromeContext';

const dockIconIdle =
  'text-muted-foreground/85 group-hover:text-foreground/90 dark:text-muted-foreground dark:group-hover:text-foreground';

const dockIconActive =
  'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]';

const dockSurfaceIdle = 'hover:bg-black/[0.06] dark:hover:bg-white/[0.08]';

const dockSurfaceActive =
  'bg-black/[0.1] dark:bg-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] dark:shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]';

/** iPad-style frosted bar — horizontal on mobile, vertical stack on desktop left */
const appleGlassNav = cn(
  'isolate flex w-full flex-nowrap items-center justify-center gap-0.5 rounded-2xl p-1.5 md:w-auto md:flex-col md:gap-1.5 md:rounded-[1.35rem] md:p-3 md:py-3.5',
  'border border-black/[0.06] dark:border-white/[0.12]',
  'bg-white/65 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]',
  'dark:bg-neutral-900/55 dark:shadow-[0_12px_40px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.2)]',
  'backdrop-blur-2xl backdrop-saturate-[1.6] [-webkit-backdrop-filter:blur(24px)_saturate(1.6)]',
  'ring-1 ring-black/[0.04] dark:ring-white/[0.06]'
);

const mobileDockItem = cn(
  'group relative flex h-10 min-w-0 flex-1 basis-0 items-center justify-center rounded-xl',
  'transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
  'active:scale-95',
  'md:h-auto md:min-h-[3.25rem] md:min-w-[3.25rem] md:flex-none md:basis-auto md:rounded-2xl'
);

const mobileDockIcon = cn(
  'h-[18px] w-[18px] transition-[transform,color,opacity] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
  'group-hover:scale-[1.06] md:h-6 md:w-6'
);

function isNavItemActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavBar({ autoHideOnHomeMobile = false }: { autoHideOnHomeMobile?: boolean }) {
  const pathname = usePathname();
  const chromeVisible = useHomeScrollChromeVisible();
  const hideChrome = autoHideOnHomeMobile && !chromeVisible;

  return (
    <aside
      className={cn(
        'pointer-events-none fixed z-[100]',
        autoHideOnHomeMobile &&
          'max-md:transition-transform duration-300 ease-out',
        hideChrome && 'max-md:translate-y-full',
        /* mobile: bottom dock, full width with safe inset */
        'inset-x-3 bottom-[max(1rem,env(safe-area-inset-bottom,0px))] flex justify-center md:inset-x-auto',
        /* desktop: left rail, vertically centered */
        'md:left-[max(1rem,env(safe-area-inset-left,0px))] md:top-1/2 md:w-auto md:-translate-y-1/2 md:justify-start',
        'md:bottom-auto md:right-auto'
      )}
    >
      <nav
        aria-label="Main navigation"
        className={cn(
          'w-full min-w-0 md:w-auto',
          hideChrome ? 'pointer-events-none' : 'pointer-events-auto',
          appleGlassNav
        )}
      >
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = isNavItemActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                mobileDockItem,
                isActive ? dockSurfaceActive : dockSurfaceIdle
              )}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={0}
            >
              <span className="sr-only">{item.label}</span>
              <Icon
                aria-hidden
                strokeWidth={isActive ? 2.25 : 2}
                className={cn(
                  mobileDockIcon,
                  isActive ? dockIconActive : dockIconIdle
                )}
              />
              <span
                className={cn(
                  'pointer-events-none absolute z-10 rounded-lg px-2 py-1',
                  'invisible opacity-0 transition-all duration-200 ease-out',
                  'hidden md:block',
                  'text-[12px] font-medium tracking-wide text-foreground',
                  'bg-popover/95 shadow-md ring-1 ring-border/60 backdrop-blur-xl',
                  'md:left-full md:ml-2 md:translate-x-1',
                  'md:group-hover:visible md:group-hover:translate-x-0 md:group-hover:opacity-100'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import { sidebarItems } from '@/data/NavBarItems';
import {
  isPsycodeMobileViewport,
  openPsycodeChat,
  setPsycodeLauncherVisible,
} from '@/lib/psycode-chat';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { useEffect } from 'react';

const dockIconIdle =
  'text-muted-foreground/85 group-hover:text-foreground/90 dark:text-muted-foreground dark:group-hover:text-foreground';

const dockIconActive = 'text-foreground';

const dockSurfaceIdle = 'hover:bg-black/[0.06] dark:hover:bg-white/[0.08]';

const dockSurfaceActive =
  'bg-black/[0.1] dark:bg-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] dark:shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]';

/** iPad-style frosted bar — horizontal on mobile, vertical stack on desktop left */
const appleGlassNav = cn(
  'isolate flex flex-nowrap items-center justify-center gap-1 rounded-2xl p-2 sm:gap-1.5 sm:p-2.5 md:flex-col md:gap-1.5 md:rounded-[1.35rem] md:p-3 md:py-3.5',
  'border border-black/[0.06] dark:border-white/[0.12]',
  'bg-white/65 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]',
  'dark:bg-neutral-900/55 dark:shadow-[0_12px_40px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.2)]',
  'backdrop-blur-2xl backdrop-saturate-[1.6] [-webkit-backdrop-filter:blur(24px)_saturate(1.6)]',
  'ring-1 ring-black/[0.04] dark:ring-white/[0.06]'
);

export function NavBar() {
  const pathname = usePathname();

  /* Hide Psycode’s fixed FAB on mobile; nav bar owns the chat affordance there. */
  useEffect(() => {
    const sync = () => {
      const hideLauncher = isPsycodeMobileViewport();
      setPsycodeLauncherVisible(!hideLauncher);
    };
    sync();
    const mq = window.matchMedia('(max-width: 767px)');
    mq.addEventListener('change', sync);
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    const stop = window.setTimeout(() => observer.disconnect(), 20000);
    return () => {
      mq.removeEventListener('change', sync);
      observer.disconnect();
      clearTimeout(stop);
      setPsycodeLauncherVisible(true);
    };
  }, []);

  return (
    <aside
      className={cn(
        'pointer-events-none fixed z-50',
        /* mobile: bottom dock, centered */
        'bottom-[max(1rem,env(safe-area-inset-bottom,0px))] left-1/2 flex w-full max-w-none -translate-x-1/2 justify-center px-3',
        /* desktop: left rail, vertically centered */
        'md:left-[max(1rem,env(safe-area-inset-left,0px))] md:top-1/2 md:w-auto md:-translate-y-1/2 md:translate-x-0 md:justify-start md:px-0',
        'md:bottom-auto md:right-auto'
      )}
    >
      <nav
        aria-label="Main navigation"
        className={cn(
          'pointer-events-auto max-w-[min(100%,32rem)] sm:max-w-none md:max-w-none',
          appleGlassNav
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
                'group relative flex min-h-12 min-w-12 flex-shrink-0 items-center justify-center rounded-xl transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] sm:min-h-[3.25rem] sm:min-w-[3.25rem] md:min-h-[3.25rem] md:min-w-[3.25rem] md:rounded-2xl',
                'active:scale-95',
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
                  'h-5 w-5 transition-[transform,color,opacity] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] sm:h-6 sm:w-6',
                  'group-hover:scale-[1.06]',
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
        <button
          type="button"
          className={cn(
            'md:hidden',
            'group relative flex min-h-12 min-w-12 flex-shrink-0 items-center justify-center rounded-xl transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] sm:min-h-[3.25rem] sm:min-w-[3.25rem]',
            'active:scale-95',
            dockSurfaceIdle
          )}
          onClick={() => openPsycodeChat()}
          aria-label="Open chat assistant"
        >
          <MessageCircle
            aria-hidden
            strokeWidth={2}
            className={cn(
              'h-5 w-5 transition-[transform,color,opacity] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] sm:h-6 sm:w-6',
              'group-hover:scale-[1.06]',
              dockIconIdle
            )}
          />
        </button>
      </nav>
    </aside>
  );
}

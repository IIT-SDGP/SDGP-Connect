// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type HomeScrollChromeContextValue = {
  visible: boolean;
};

const HomeScrollChromeContext = createContext<HomeScrollChromeContextValue>({
  visible: true,
});

const DEFAULT_HIDE_DELAY_MS = 2500;

export function HomeScrollChromeProvider({
  enabled,
  children,
  hideDelayMs = DEFAULT_HIDE_DELAY_MS,
}: {
  enabled: boolean;
  children: ReactNode;
  hideDelayMs?: number;
}) {
  const [visible, setVisible] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setVisible(true);
      return;
    }

    setVisible(false);

    const reveal = () => {
      setVisible(true);
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
      }, hideDelayMs);
    };

    window.addEventListener('scroll', reveal, { passive: true });
    window.addEventListener('touchmove', reveal, { passive: true });

    return () => {
      window.removeEventListener('scroll', reveal);
      window.removeEventListener('touchmove', reveal);
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, [enabled, hideDelayMs]);

  return (
    <HomeScrollChromeContext.Provider value={{ visible }}>
      {children}
    </HomeScrollChromeContext.Provider>
  );
}

export function useHomeScrollChromeVisible() {
  return useContext(HomeScrollChromeContext).visible;
}

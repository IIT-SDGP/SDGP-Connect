// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";
import { useState, useEffect } from 'react';

/**
 * A hook that detects if the current device is a mobile device
 * based on the screen width.
 * 
 * @param breakpoint The width threshold in pixels to consider a device as mobile (default: 768)
 * @returns Boolean indicating if the device is mobile
 */
export default function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check on client side
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < breakpoint);
      };

      // Set initial value
      checkIfMobile();
      
      // Add event listener for window resize
      window.addEventListener('resize', checkIfMobile);
      
      // Cleanup event listener on component unmount
      return () => window.removeEventListener('resize', checkIfMobile);
    }
  }, [breakpoint]);

  return isMobile;
}

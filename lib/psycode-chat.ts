// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

/** Psycode Chat Widget host (widget.js) — FAB lives in shadow DOM. */

export function queryPsycodeFab(): HTMLButtonElement | null {
  const host = document.getElementById('psycode-chat-host');
  return host?.shadowRoot?.querySelector<HTMLButtonElement>('#cb-fab') ?? null;
}

export function openPsycodeChat(): void {
  queryPsycodeFab()?.click();
}

/**
 * Show or hide the widget’s floating launcher (and “Chat with us” chip).
 * @returns true if the shadow tree was found and updated
 */
export function setPsycodeLauncherVisible(visible: boolean): boolean {
  const host = document.getElementById('psycode-chat-host');
  const shadow = host?.shadowRoot;
  if (!shadow) return false;
  const display = visible ? '' : 'none';
  const fab = shadow.querySelector<HTMLElement>('#cb-fab');
  const fabLabel = shadow.querySelector<HTMLElement>('#cb-fab-label');
  if (fab) fab.style.display = display;
  if (fabLabel) fabLabel.style.display = display;
  return true;
}

const MOBILE_MAX = 767;

export function isPsycodeMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;
}

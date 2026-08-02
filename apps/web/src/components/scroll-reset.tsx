"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Scrolls to the top when the route changes.
 *
 * Next is supposed to do this itself, but its heuristic scrolls the changed
 * segment into view rather than the window, and after following an in-page
 * anchor (the docs "on this page" rail) a navigation could land mid-scroll on
 * the new page. This makes the behaviour unconditional: new pathname, top of
 * page.
 *
 * Two deliberate exceptions:
 * - a hash in the destination wins, that navigation is *to* a section
 * - back/forward keep the browser's restored position, detected via popstate,
 *   which fires before the router re-renders
 */
export function ScrollReset() {
  const pathname = usePathname();
  const traversing = useRef(false);

  useEffect(() => {
    const onPop = () => {
      traversing.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (traversing.current) {
      traversing.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

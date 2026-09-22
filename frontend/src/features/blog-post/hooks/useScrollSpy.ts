import { useState, useEffect, useCallback } from "react";

/**
 * Scroll-spy hook: observes heading elements and returns the ID of the one
 * currently at/near the top of the viewport.
 */
export function useScrollSpy(ids: string[], offset = 100): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the first visible entry closest to the top
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (visible.length > 0) {
      setActiveId(visible[0].target.id);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: `-${offset}px 0px -60% 0px`,
      threshold: 0,
    });

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids, offset, handleIntersect]);

  return activeId;
}

import { useState, useEffect } from "react";

/**
 * Scroll-spy hook: observes heading elements and returns the ID of the one
 * currently intersecting the reading position near the top of the viewport.
 */
export function useScrollSpy(
  ids: string[],
  offset = 120
): string | null {
  const [activeId, setActiveId] = useState<string | null>(
    ids[0] || null
  );

  const idsKey = ids.join(",");

  useEffect(() => {
    if (!ids.length) {
      setActiveId(null);
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });

        const current = elements
          .filter((element) => visible.has(element.id))
          .sort(
            (left, right) =>
              left.getBoundingClientRect().top - right.getBoundingClientRect().top,
          )[0];

        if (current) setActiveId(current.id);
      },
      { rootMargin: `-${offset}px 0px -70% 0px`, threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [idsKey, offset]);

  return activeId;
}
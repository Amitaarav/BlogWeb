import { useState, useEffect } from "react";

/**
 * Scroll-spy hook: observes heading elements and returns the ID of the one
 * currently at/near the top of the viewport.
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

    const onScroll = () => {
      const scrollPos = window.scrollY + offset;
      let currentId = ids[0];

      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);

        if (el) {
          const top = el.offsetTop;

          if (scrollPos >= top - 20) {
            currentId = ids[i];
          }
        }
      }

      setActiveId(currentId);
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [idsKey, ids, offset]);

  return activeId;
}
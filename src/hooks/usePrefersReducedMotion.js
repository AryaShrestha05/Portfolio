import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the user's reduced-motion preference so components can pick a
 * different *layout* when motion is off, not just a shorter animation.
 *
 * GSAP's matchMedia handles disabling tweens. This hook exists for the cases
 * where removing an animation also removes the mechanism that made a section
 * reachable, e.g. a scroll-hijacked horizontal track that needs to become a
 * natively scrollable list instead.
 */
const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (event) => setPrefersReduced(event.matches);

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return prefersReduced;
};

export default usePrefersReducedMotion;

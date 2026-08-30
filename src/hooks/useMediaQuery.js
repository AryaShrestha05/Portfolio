import { useEffect, useState } from 'react';

/**
 * Subscribes to a media query and re-renders when it changes.
 *
 * Used to keep expensive, pointer-driven effects off devices that cannot
 * drive them, rather than rendering and hiding them with CSS.
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;

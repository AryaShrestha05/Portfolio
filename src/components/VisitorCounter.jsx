import { useEffect, useState } from 'react';

/** Free public fallback (no setup) if Redis API is unavailable */
const COUNT_NAMESPACE = 'aryashrestha-portfolio';
const COUNT_KEY = 'site_visits-v1';
const COUNTAPI_HIT = `https://api.countapi.xyz/hit/${COUNT_NAMESPACE}/${COUNT_KEY}`;

const BUMP_KEY = Symbol.for('portfolioVisitorBumpPromise');

async function fetchCount(url, init = {}) {
  const res = await fetch(url, {
    cache: 'no-store',
    ...init,
  });
  if (!res.ok) throw new Error(`counter ${res.status}`);
  const data = await res.json();
  const value = data?.value ?? data?.count;
  if (typeof value !== 'number') throw new Error('counter bad shape');
  return value;
}

function createBumpPromise() {
  return (async () => {
    const explicit = import.meta.env.VITE_VISITOR_API_URL;
    if (explicit) {
      try {
        return await fetchCount(explicit, {
          method: 'POST',
          headers: { Accept: 'application/json' },
        });
      } catch {
        /* fall through */
      }
    }

    if (!import.meta.env.DEV) {
      try {
        return await fetchCount('/api/visits', {
          method: 'POST',
          headers: { Accept: 'application/json' },
        });
      } catch {
        /* fall through */
      }
    }

    return await fetchCount(COUNTAPI_HIT, { method: 'GET' });
  })();
}

function getBumpPromise() {
  if (typeof globalThis === 'undefined') return null;
  if (globalThis[BUMP_KEY]) return globalThis[BUMP_KEY];
  globalThis[BUMP_KEY] = createBumpPromise();
  return globalThis[BUMP_KEY];
}

export default function VisitorCounter() {
  const [count, setCount] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (import.meta.env.VITE_DISABLE_VISITOR_COUNTER === 'true') {
      return;
    }

    const p = getBumpPromise();
    if (!p) return;

    p.then(setCount).catch(() => setFailed(true));
  }, []);

  if (import.meta.env.VITE_DISABLE_VISITOR_COUNTER === 'true') {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-[45] max-w-[min(100vw-2rem,18rem)] pointer-events-none select-none"
      aria-live="polite"
    >
      <p className="font-sans text-[9px] sm:text-[10px] text-muted-foreground leading-snug normal-case tracking-normal">
        {failed ? (
          <span className="opacity-60">Counter unavailable</span>
        ) : count === null ? (
          <span className="opacity-60">Loading…</span>
        ) : (
          <>
            <span className="text-foreground/90 font-semibold tabular-nums">{count.toLocaleString()}</span>{' '}
            <span className="opacity-90">people viewed this site!</span>
          </>
        )}
      </p>
    </div>
  );
}

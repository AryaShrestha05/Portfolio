/**
 * Shared motion tokens.
 *
 * Every scroll-driven section imports from here so easing and scrub feel
 * identical across the page. Tweaking a value here retunes the whole site.
 */

// Custom cubic-bezier matching the CSS `--ease-out-expo` token in index.css.
// Fast start, long settle. Reads as "expensive" rather than bouncy.
export const EASE = 'expo.out';
export const EASE_SOFT = 'power3.out';
export const EASE_SCRUB = 'none';

// Scrub values. Higher = more lag between scroll and animation = smoother,
// but too high feels disconnected. 0.8 is the sweet spot with Lenis running.
export const SCRUB = 0.8;
export const SCRUB_SLOW = 1.2;

// Entrance timings.
export const DURATION = 1.1;
export const DURATION_FAST = 0.7;
export const STAGGER = 0.08;

/**
 * Breakpoint + reduced-motion conditions for `gsap.matchMedia()`.
 *
 * Passing these as a conditions object lets each section branch on
 * `ctx.conditions.reduce` instead of hand-rolling a media query listener.
 * GSAP reverts the context automatically when a condition stops matching.
 */
export const MQ = {
  isDesktop: '(min-width: 1024px)',
  isMobile: '(max-width: 1023px)',
  reduce: '(prefers-reduced-motion: reduce)',
};

/**
 * Parallax distance helper. Returns 0 under reduced motion so callers can
 * animate unconditionally without branching at every call site.
 */
export const parallax = (distance, { reduce, isDesktop }) => {
  if (reduce) return 0;
  return isDesktop ? distance : distance * 0.35;
};

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives the page with Lenis and hands frame control to GSAP's ticker so
 * smooth scrolling and ScrollTrigger stay on the same clock.
 *
 * Without this the two run on separate rAF loops, which is what makes pinned
 * sections judder by a frame on every scroll direction change.
 *
 * Disabled entirely under `prefers-reduced-motion` so the browser's native
 * scroll (and any assistive tech that depends on it) is left alone.
 */
const useSmoothScroll = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReduced.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out. Matches EASE in lib/motion.js so a scroll and a
      // tween that start together also finish together.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices already have native momentum. Syncing Lenis on top of
      // it fights the OS and feels laggy, so touch stays native.
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
      // GSAP's ticker drives raf below; Lenis must not run its own loop.
      autoRaf: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time) => {
      // GSAP ticker reports seconds, Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    // The ticker's built-in smoothing fights Lenis for control of delta time.
    gsap.ticker.lagSmoothing(0);

    // Published so anchor navigation can scroll through Lenis instead of
    // calling scrollIntoView, which would fight it. GooeyNav reads this and
    // falls back to native scrolling when it is absent.
    window.__lenis = lenis;

    // Pinned sections measure their scroll distance on creation. Fonts and
    // GIFs settling afterwards change those numbers, so remeasure once the
    // page has fully loaded.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      delete window.__lenis;
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [enabled]);
};

export default useSmoothScroll;

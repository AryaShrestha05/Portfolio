import { useEffect, useRef, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({
  targetSelector = '.cursor-target',
  hideDefaultCursor = true,
  hoverDuration = 0.3,
  isVisible = true
}) => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const isVisibleRef = useRef(isVisible);
  const isActiveRef = useRef(false);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.15,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const originalCursor = document.body.style.cursor;

    // Initial Position
    gsap.set(cursorRef.current, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    // Global Handlers
    const moveHandler = (e) => {
      if (!isVisibleRef.current) return;
      moveCursor(e.clientX, e.clientY);
    };

    let activeTarget = null;
    let currentLeaveHandler = null;

    const cleanupTarget = (target) => {
      if (currentLeaveHandler && target) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    const mouseDownHandler = () => {
      if (!ringRef.current) return;
      gsap.to(ringRef.current, { scale: 0.85, duration: 0.15 });
    };

    const mouseUpHandler = () => {
      if (!ringRef.current) return;
      gsap.to(ringRef.current, { scale: 1, duration: 0.15 });
    };

    const enterHandler = (e) => {
      if (!isVisibleRef.current) return;

      let target = e.target.closest(targetSelector);
      if (!target) return;

      if (activeTarget === target) return;
      if (activeTarget) cleanupTarget(activeTarget);

      activeTarget = target;
      isActiveRef.current = true;

      // Get target dimensions for the ring to expand to
      const rect = target.getBoundingClientRect();
      const padding = 16;
      const targetWidth = rect.width + padding;
      const targetHeight = rect.height + padding;

      // Expand ring to cover the target element
      if (ringRef.current) {
        ringRef.current.classList.add('is-hovering');
        gsap.to(ringRef.current, {
          width: targetWidth,
          height: targetHeight,
          duration: hoverDuration,
          ease: 'power2.out'
        });
      }


      // Leave Handler
      const leaveHandler = () => {
        isActiveRef.current = false;
        activeTarget = null;

        // Return ring to default size
        if (ringRef.current) {
          ringRef.current.classList.remove('is-hovering');
          gsap.to(ringRef.current, {
            width: 32,
            height: 32,
            duration: hoverDuration,
            ease: 'power2.out'
          });
        }

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mousemove', moveHandler, { passive: true });
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('mouseover', enterHandler, { passive: true });

    // Hide default cursor
    if (hideDefaultCursor) document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mouseover', enterHandler);
      document.body.style.cursor = originalCursor;
    };
  }, [targetSelector, hideDefaultCursor, isMobile, hoverDuration, moveCursor]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: isVisible ? 1 : 0,
        duration: 0.3
      });
      if (hideDefaultCursor) {
        document.body.style.cursor = isVisible ? 'none' : 'auto';
      }
    }
  }, [isVisible, hideDefaultCursor]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={ringRef} className="target-cursor-ring" />
    </div>
  );
};

export default TargetCursor;

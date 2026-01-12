import { useEffect, useRef, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  isVisible = true
}) => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const cornersRef = useRef(null);
  const spinTl = useRef(null);
  const isVisibleRef = useRef(isVisible);
  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef(null);
  const activeStrengthRef = useRef({ current: 0 });
  const tickerFnRef = useRef(null);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const constants = useMemo(() => ({
    borderWidth: 3,
    cornerSize: 12
  }), []);

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // Use querySelectorAll now that refs are mounted
    if (cursorRef.current) {
      cornersRef.current = cursorRef.current.querySelectorAll('.target-cursor-corner');
    }

    const originalCursor = document.body.style.cursor;

    // Initial Position
    gsap.set(cursorRef.current, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    // Spin Animation
    const createSpinTimeline = () => {
      if (spinTl.current) spinTl.current.kill();
      spinTl.current = gsap.timeline({ repeat: -1 })
        .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };
    createSpinTimeline();

    // Ticker Logic for Snapping
    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) return;

      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(cursorRef.current, 'x');
      const cursorY = gsap.getProperty(cursorRef.current, 'y');

      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x');
        const currentY = gsap.getProperty(corner, 'y');

        const targetPos = targetCornerPositionsRef.current[i];
        const targetX = targetPos.x - cursorX;
        const targetY = targetPos.y - cursorY;

        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;

        // When strength is high (fully snapped), update fast (parallax).
        // When transitioning, use slower easing.
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };
    tickerFnRef.current = tickerFn;

    // Global Handlers
    const moveHandler = (e) => {
      if (!isVisibleRef.current) return;
      moveCursor(e.clientX, e.clientY);
    };

    let activeTarget = null;
    let currentLeaveHandler = null;
    let resumeTimeout = null;

    const cleanupTarget = (target) => {
      if (currentLeaveHandler && target) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    const scrollHandler = () => {
      if (!isVisibleRef.current || !activeTarget || !cursorRef.current) return;
      // Check if cursor is still over target during scroll
      const mouseX = gsap.getProperty(cursorRef.current, 'x');
      const mouseY = gsap.getProperty(cursorRef.current, 'y');
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);

      const isStillOverTarget = elementUnderMouse && (
        elementUnderMouse === activeTarget ||
        elementUnderMouse.closest(targetSelector) === activeTarget
      );

      if (!isStillOverTarget && currentLeaveHandler) {
        currentLeaveHandler();
      }
    };

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };
    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    const enterHandler = (e) => {
      if (!isVisibleRef.current) return;

      let target = e.target.closest(targetSelector);
      if (!target) return;

      if (activeTarget === target) return;
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;

      // Kill existing tweens
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner));
      gsap.killTweensOf(cursorRef.current, 'rotation');
      if (spinTl.current) spinTl.current.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      // Calculate Target
      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const cursorX = gsap.getProperty(cursorRef.current, 'x');
      const cursorY = gsap.getProperty(cursorRef.current, 'y');

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
        { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
      ];

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current);

      // Animate Strength
      gsap.to(activeStrengthRef.current, {
        current: 1,
        duration: hoverDuration,
        ease: 'power2.out'
      });

      // Initial Jump for Corners
      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current[i].x - cursorX,
          y: targetCornerPositionsRef.current[i].y - cursorY,
          duration: 0.2, // fast initial snap
          ease: 'power2.out'
        });
      });

      // Leave Handler
      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current);
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
        activeTarget = null;

        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current);
          gsap.killTweensOf(corners);
          const positions = [
            { x: -constants.cornerSize * 1.5, y: -constants.cornerSize * 1.5 },
            { x: constants.cornerSize * 0.5, y: -constants.cornerSize * 1.5 },
            { x: constants.cornerSize * 0.5, y: constants.cornerSize * 0.5 },
            { x: -constants.cornerSize * 1.5, y: constants.cornerSize * 0.5 }
          ];
          gsap.timeline()
            .to(corners, {
              x: (i) => positions[i].x,
              y: (i) => positions[i].y,
              duration: 0.3,
              ease: 'power3.out'
            });
        }

        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            // Resume spin smoothly
            const currentRot = gsap.getProperty(cursorRef.current, 'rotation') % 360;
            spinTl.current.kill();
            spinTl.current = gsap.timeline({ repeat: -1 })
              .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });

            gsap.to(cursorRef.current, {
              rotation: currentRot + 360,
              duration: spinDuration * (1 - currentRot / 360),
              ease: 'none',
              onComplete: () => {
                if (!isActiveRef.current) spinTl.current.restart();
              }
            });
          }
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };
      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mousemove', moveHandler, { passive: true });
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('mouseover', enterHandler, { passive: true });

    // Hide default cursor
    if (hideDefaultCursor) document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mouseover', enterHandler);
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      if (spinTl.current) spinTl.current.kill();
      document.body.style.cursor = originalCursor;
    };
  }, [targetSelector, spinDuration, hideDefaultCursor, isMobile, hoverDuration, parallaxOn, constants]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: isVisible ? 1 : 0,
        duration: 0.3
      });
      if (spinTl.current) {
        isVisible ? spinTl.current.resume() : spinTl.current.pause();
      }
      if (hideDefaultCursor) {
        document.body.style.cursor = isVisible ? 'none' : 'auto';
      }
    }
  }, [isVisible, hideDefaultCursor]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
};

export default TargetCursor;

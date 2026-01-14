import { useEffect, useRef, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({
  targetSelector = '.cursor-target',
  hideDefaultCursor = true,
  hoverDuration = 0.4,
  isVisible = true
}) => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const isVisibleRef = useRef(isVisible);
  const activeTargetRef = useRef(null);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    return (window.innerWidth <= 768) || mobileRegex.test(navigator.userAgent.toLowerCase());
  }, []);

  const moveCursor = useCallback((mouseX, mouseY) => {
    if (!cursorRef.current) return;

    let targetX = mouseX;
    let targetY = mouseY;

    if (activeTargetRef.current) {
      const rect = activeTargetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Magnetic pull: 0.2 means it moves 20% of the way toward mouse
      const magneticPull = 0.2;
      targetX = centerX + (mouseX - centerX) * magneticPull;
      targetY = centerY + (mouseY - centerY) * magneticPull;
    }

    gsap.to(cursorRef.current, {
      x: targetX,
      y: targetY,
      duration: activeTargetRef.current ? 0.2 : 0.1,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }, []);

  useEffect(() => {
    if (isMobile) return;

    if (hideDefaultCursor) {
      const style = document.createElement('style');
      style.id = 'hide-cursor-style';
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
    }

    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });

    const enterHandler = (e) => {
      const target = e.target.closest(targetSelector);
      if (!target || activeTargetRef.current === target) return;

      activeTargetRef.current = target;
      
      const rect = target.getBoundingClientRect();
      const padding = 12;
      const h = rect.height + padding;
      const w = rect.width + padding;

      // STADIUM/PILL CALCULATION:
      // To prevent ovals on rectangles, the radius must be exactly half the height.
      const finalRadius = `${h / 2}px`;

      if (ringRef.current) {
        ringRef.current.classList.add('is-hovering');
        
        gsap.to(ringRef.current, {
          width: w,
          height: h,
          borderRadius: finalRadius,
          duration: hoverDuration,
          ease: "expo.out",
        });
      }
    };

    const leaveHandler = (e) => {
      const target = e.target.closest(targetSelector);
      if (!target) return;

      activeTargetRef.current = null;

      if (ringRef.current) {
        ringRef.current.classList.remove('is-hovering');
        
        gsap.to(ringRef.current, {
          width: 16,
          height: 16,
          borderRadius: "50%",
          duration: hoverDuration,
          ease: "expo.out",
        });
      }
    };

    const moveHandler = (e) => {
      if (!isVisibleRef.current) return;
      moveCursor(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', moveHandler, { passive: true });
    window.addEventListener('mouseover', enterHandler, { passive: true });
    window.addEventListener('mouseout', leaveHandler, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('mouseout', leaveHandler);
      const styleTag = document.getElementById('hide-cursor-style');
      if (styleTag) styleTag.remove();
    };
  }, [targetSelector, hideDefaultCursor, isMobile, hoverDuration, moveCursor]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper" style={{ opacity: isVisible ? 1 : 0 }}>
      <div ref={ringRef} className="target-cursor-ring" />
    </div>
  );
};

export default TargetCursor;
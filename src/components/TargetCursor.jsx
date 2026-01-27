import { useEffect, useRef, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({
  targetSelector = '.cursor-target',
  hideDefaultCursor = true,
  isVisible = true
}) => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const trailsRef = useRef([]);
  const isVisibleRef = useRef(isVisible);
  const activeTargetRef = useRef(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const isClickingRef = useRef(false);
  const rafRef = useRef(null);
  const lastMouseMoveTimeRef = useRef(Date.now());
  const resetTimeoutRef = useRef(null);
  const targetSelectorRef = useRef(targetSelector);
  
  // Keep targetSelector ref updated
  useEffect(() => {
    targetSelectorRef.current = targetSelector;
  }, [targetSelector]);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    return (window.innerWidth <= 768) || mobileRegex.test(navigator.userAgent.toLowerCase());
  }, []);

  // Smooth spring-based animation loop
  const animate = useCallback(() => {
    if (!cursorRef.current || !dotRef.current || !ringRef.current) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    // Safety check: if activeTarget no longer exists in DOM, reset it
    if (activeTargetRef.current && !document.contains(activeTargetRef.current)) {
      resetCursor();
    }

    // Periodic validation: check if we're actually still hovering over the target
    if (activeTargetRef.current && ringRef.current) {
      const now = Date.now();
      // Check every 100ms if we're still over the target
      if (now - lastMouseMoveTimeRef.current > 100) {
        const elementAtPoint = document.elementFromPoint(
          targetPosRef.current.x,
          targetPosRef.current.y
        );
        
        if (elementAtPoint) {
          const isOverTarget = 
            activeTargetRef.current.contains(elementAtPoint) ||
            activeTargetRef.current === elementAtPoint ||
            elementAtPoint.closest(targetSelectorRef.current) === activeTargetRef.current;
          
          if (!isOverTarget) {
            // We're not actually over the target anymore, reset
            resetCursor();
          }
        } else {
          // No element at cursor position, reset
          resetCursor();
        }
        lastMouseMoveTimeRef.current = now;
      }

      // Safety check: if ring is stuck in expanded state but we don't have an active target
      // This can happen if the state got out of sync
      const computedStyle = window.getComputedStyle(ringRef.current);
      const currentWidth = parseFloat(computedStyle.width);
      const currentHeight = parseFloat(computedStyle.height);
      const isExpanded = currentWidth > 30 || currentHeight > 30; // Normal size is 20px
      
      if (isExpanded && !ringRef.current.classList.contains('is-hovering')) {
        // Ring is expanded but not marked as hovering - force reset
        resetCursor(true);
      }
    } else if (ringRef.current) {
      // No active target but check if ring is stuck expanded
      const computedStyle = window.getComputedStyle(ringRef.current);
      const currentWidth = parseFloat(computedStyle.width);
      const currentHeight = parseFloat(computedStyle.height);
      const isExpanded = currentWidth > 30 || currentHeight > 30;
      
      if (isExpanded || ringRef.current.classList.contains('is-hovering')) {
        // Ring is stuck in expanded/hovering state - force reset
        resetCursor(true);
      }
    }

    const pos = positionRef.current;
    const target = targetPosRef.current;

    // Calculate velocity
    const prevX = pos.x;
    const prevY = pos.y;

    // Spring physics for smooth following - subtle lag and bounce
    const springStrength = 0.15;
    const damping = 0.75;

    // Dot follows faster
    const dotSpring = 0.25;

    // Update velocity with spring physics
    velocityRef.current.x += (target.x - pos.x) * springStrength;
    velocityRef.current.y += (target.y - pos.y) * springStrength;
    velocityRef.current.x *= damping;
    velocityRef.current.y *= damping;

    // Update position
    pos.x += velocityRef.current.x;
    pos.y += velocityRef.current.y;

    // Calculate speed for effects
    const speed = Math.sqrt(
      Math.pow(pos.x - prevX, 2) + Math.pow(pos.y - prevY, 2)
    );

    // Calculate angle for rotation (only when not hovering)
    const angle = Math.atan2(velocityRef.current.y, velocityRef.current.x) * (180 / Math.PI);

    // Scale based on velocity (stretch effect) - subtle
    const maxStretch = 1.6;
    const stretchAmount = Math.min(speed / 8, maxStretch - 1);
    const scaleX = 1 + stretchAmount * 0.5;
    const scaleY = 1 - stretchAmount * 0.2;

    // Apply transforms to ring (outer, follows with delay)
    // Rotation only when freely moving, NOT when hovering on buttons
    gsap.set(ringRef.current, {
      x: pos.x,
      y: pos.y,
      rotation: activeTargetRef.current ? 0 : (speed > 0.5 ? angle : 0),
      scaleX: activeTargetRef.current ? 1 : scaleX,
      scaleY: activeTargetRef.current ? 1 : scaleY,
    });

    // Dot follows more precisely
    const dotX = prevX + (target.x - prevX) * dotSpring + velocityRef.current.x;
    const dotY = prevY + (target.y - prevY) * dotSpring + velocityRef.current.y;

    gsap.set(dotRef.current, {
      x: target.x,
      y: target.y,
      scale: isClickingRef.current ? 0.5 : 1,
    });

    // Glow follows ring
    if (glowRef.current) {
      gsap.set(glowRef.current, {
        x: pos.x,
        y: pos.y,
        opacity: Math.min(speed / 20, 0.6),
      });
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const resetCursor = useCallback((force = false) => {
    if (!activeTargetRef.current && !force) return;

    // Kill any ongoing GSAP animations
    if (ringRef.current) {
      gsap.killTweensOf(ringRef.current);
    }
    if (dotRef.current) {
      gsap.killTweensOf(dotRef.current);
    }

    activeTargetRef.current = null;

    if (ringRef.current) {
      ringRef.current.classList.remove('is-hovering');

      // Force immediate reset if needed, otherwise animate
      if (force) {
        gsap.set(ringRef.current, {
          width: 20,
          height: 20,
          borderRadius: "50%",
        });
      } else {
        gsap.to(ringRef.current, {
          width: 20,
          height: 20,
          borderRadius: "50%",
          duration: 0.4,
          ease: "elastic.out(1, 0.6)",
        });
      }
    }

    if (dotRef.current) {
      if (force) {
        gsap.set(dotRef.current, {
          opacity: 0,
          scale: 0.5,
        });
      } else {
        gsap.to(dotRef.current, {
          opacity: 0,
          scale: 0.5,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }

    // Clear any pending reset timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isVisibleRef.current) return;

    lastMouseMoveTimeRef.current = Date.now();

    let targetX = e.clientX;
    let targetY = e.clientY;

    if (activeTargetRef.current) {
      // Verify target still exists in DOM
      if (!document.contains(activeTargetRef.current)) {
        resetCursor();
        targetPosRef.current = { x: targetX, y: targetY };
        return;
      }

      // Use elementFromPoint to verify we're actually over the target
      const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
      const isOverTarget = elementAtPoint && (
        activeTargetRef.current.contains(elementAtPoint) ||
        activeTargetRef.current === elementAtPoint ||
        elementAtPoint.closest(targetSelector) === activeTargetRef.current
      );

      if (!isOverTarget) {
        // Not actually over target, reset cursor
        resetCursor();
        targetPosRef.current = { x: targetX, y: targetY };
        return;
      }

      const rect = activeTargetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Magnetic pull with easing
      const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
      const maxDistance = Math.max(rect.width, rect.height);
      const pull = Math.max(0, 1 - distance / maxDistance) * 0.4;

      targetX = e.clientX + (centerX - e.clientX) * pull;
      targetY = e.clientY + (centerY - e.clientY) * pull;

      // Clear any pending reset timeout since we're still over the target
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    } else {
      // Not hovering, clear any pending timeout
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    }

    targetPosRef.current = { x: targetX, y: targetY };
  }, [resetCursor, targetSelector]);

  const handleMouseEnter = useCallback((e) => {
    const target = e.target.closest(targetSelector);
    if (!target || activeTargetRef.current === target) return;

    // Reset any previous target first
    if (activeTargetRef.current && activeTargetRef.current !== target) {
      resetCursor(true); // Force reset when switching targets
    }

    // Clear any pending reset timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    activeTargetRef.current = target;

    const rect = target.getBoundingClientRect();
    const padding = 16;
    const h = rect.height + padding;
    const w = rect.width + padding;
    const finalRadius = `${h / 2}px`;

    if (ringRef.current) {
      // Kill any existing animations first
      gsap.killTweensOf(ringRef.current);
      ringRef.current.classList.add('is-hovering');

      // Animate ring expansion with elastic feel
      gsap.to(ringRef.current, {
        width: w,
        height: h,
        borderRadius: finalRadius,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
    }

    if (dotRef.current) {
      gsap.killTweensOf(dotRef.current);
      gsap.to(dotRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    // Set a safety timeout to reset if something goes wrong
    resetTimeoutRef.current = setTimeout(() => {
      // If we've been hovering for more than 5 seconds, verify we're still over it
      if (activeTargetRef.current === target) {
        const elementAtPoint = document.elementFromPoint(
          targetPosRef.current.x,
          targetPosRef.current.y
        );
        if (!elementAtPoint || !target.contains(elementAtPoint) && target !== elementAtPoint) {
          resetCursor();
        }
      }
    }, 5000);
  }, [targetSelector, resetCursor]);

  const handleMouseLeave = useCallback((e) => {
    // If there's no active target, nothing to reset
    if (!activeTargetRef.current) return;

    // Check if we're still inside the active target (mouse moved to child element)
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && activeTargetRef.current.contains(relatedTarget)) {
      return; // Still inside the target, don't reset
    }

    // Check if relatedTarget is null or not in the document (mouse left viewport)
    if (!relatedTarget || !document.contains(relatedTarget)) {
      resetCursor();
      return;
    }

    // Check if we're actually leaving the target
    const target = e.target.closest(targetSelector);
    if (target !== activeTargetRef.current) {
      resetCursor();
    } else {
      // Double-check with elementFromPoint as a safety measure
      setTimeout(() => {
        if (activeTargetRef.current) {
          const elementAtPoint = document.elementFromPoint(
            targetPosRef.current.x,
            targetPosRef.current.y
          );
          if (!elementAtPoint || !activeTargetRef.current.contains(elementAtPoint) && activeTargetRef.current !== elementAtPoint) {
            resetCursor();
          }
        }
      }, 50);
    }
  }, [targetSelector, resetCursor]);

  const handleMouseDown = useCallback(() => {
    isClickingRef.current = true;

    if (ringRef.current) {
      gsap.to(ringRef.current, {
        scale: 0.85,
        duration: 0.15,
        ease: "power2.out",
      });
    }

    // Create ripple effect
    if (cursorRef.current) {
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${targetPosRef.current.x}px`;
      ripple.style.top = `${targetPosRef.current.y}px`;
      cursorRef.current.appendChild(ripple);

      gsap.to(ripple, {
        scale: 3,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isClickingRef.current = false;

    if (ringRef.current) {
      gsap.to(ringRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.4)",
      });
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;

    if (hideDefaultCursor) {
      const style = document.createElement('style');
      style.id = 'hide-cursor-style';
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
    }

    // Initialize position
    positionRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    targetPosRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    const handleMouseLeaveWindow = () => {
      resetCursor(true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        resetCursor(true);
      }
    };

    const handleClickOutside = (e) => {
      // If clicking outside any cursor target, reset
      if (activeTargetRef.current && !activeTargetRef.current.contains(e.target)) {
        const clickedTarget = e.target.closest(targetSelectorRef.current);
        if (clickedTarget !== activeTargetRef.current) {
          resetCursor();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseEnter, { passive: true });
    window.addEventListener('mouseout', handleMouseLeave, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClickOutside, true);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
      resetCursor(true); // Force reset cursor state on cleanup
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseEnter);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      const styleTag = document.getElementById('hide-cursor-style');
      if (styleTag) styleTag.remove();
    };
  }, [isMobile, hideDefaultCursor, animate, handleMouseMove, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp, resetCursor]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="cursor-container" style={{ opacity: isVisible ? 1 : 0 }}>
      {/* Glow layer */}
      <div ref={glowRef} className="cursor-glow" />

      {/* Main ring */}
      <div ref={ringRef} className="cursor-ring" />

      {/* Center dot */}
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
};

export default TargetCursor;

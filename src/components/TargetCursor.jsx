import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
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
  const textRef = useRef(null);
  const trailsRef = useRef([]);
  const isVisibleRef = useRef(isVisible);
  const activeTargetRef = useRef(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const isClickingRef = useRef(false);
  const rafRef = useRef(null);
  const [hoverText, setHoverText] = useState('');

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

    const pos = positionRef.current;
    const target = targetPosRef.current;

    // Calculate velocity
    const prevX = pos.x;
    const prevY = pos.y;

    // Spring physics for smooth following
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

    // Scale based on velocity (stretch effect)
    const maxStretch = 1.5;
    const stretchAmount = Math.min(speed / 10, maxStretch - 1);
    const scaleX = 1 + stretchAmount * 0.5;
    const scaleY = 1 - stretchAmount * 0.2;

    // Apply transforms to ring (outer, follows with delay)
    // Rotation only when freely moving, NOT when hovering on buttons
    gsap.set(ringRef.current, {
      x: pos.x,
      y: pos.y,
      rotation: activeTargetRef.current ? 0 : (speed > 1 ? angle : 0),
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

  const handleMouseMove = useCallback((e) => {
    if (!isVisibleRef.current) return;

    let targetX = e.clientX;
    let targetY = e.clientY;

    if (activeTargetRef.current) {
      const rect = activeTargetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Magnetic pull with easing
      const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
      const maxDistance = Math.max(rect.width, rect.height);
      const pull = Math.max(0, 1 - distance / maxDistance) * 0.4;

      targetX = e.clientX + (centerX - e.clientX) * pull;
      targetY = e.clientY + (centerY - e.clientY) * pull;
    }

    targetPosRef.current = { x: targetX, y: targetY };
  }, []);

  const handleMouseEnter = useCallback((e) => {
    const target = e.target.closest(targetSelector);
    if (!target || activeTargetRef.current === target) return;

    activeTargetRef.current = target;

    const rect = target.getBoundingClientRect();
    const padding = 16;
    const h = rect.height + padding;
    const w = rect.width + padding;
    const finalRadius = `${h / 2}px`;

    // Get hover text from data attribute
    const text = target.dataset.cursorText || target.getAttribute('aria-label') || '';
    setHoverText(text);

    if (ringRef.current) {
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
      gsap.to(dotRef.current, {
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (textRef.current && text) {
      gsap.to(textRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        delay: 0.1,
        ease: "power2.out",
      });
    }
  }, [targetSelector]);

  const handleMouseLeave = useCallback((e) => {
    const target = e.target.closest(targetSelector);
    if (!target) return;

    activeTargetRef.current = null;
    setHoverText('');

    if (ringRef.current) {
      ringRef.current.classList.remove('is-hovering');

      gsap.to(ringRef.current, {
        width: 40,
        height: 40,
        borderRadius: "50%",
        duration: 0.4,
        ease: "elastic.out(1, 0.6)",
      });
    }

    if (dotRef.current) {
      gsap.to(dotRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
      });
    }

    if (textRef.current) {
      gsap.to(textRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [targetSelector]);

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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseEnter, { passive: true });
    window.addEventListener('mouseout', handleMouseLeave, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseEnter);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      const styleTag = document.getElementById('hide-cursor-style');
      if (styleTag) styleTag.remove();
    };
  }, [isMobile, hideDefaultCursor, animate, handleMouseMove, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="cursor-container" style={{ opacity: isVisible ? 1 : 0 }}>
      {/* Glow layer */}
      <div ref={glowRef} className="cursor-glow" />

      {/* Main ring */}
      <div ref={ringRef} className="cursor-ring">
        {/* Hover text */}
        <span ref={textRef} className="cursor-text">{hoverText}</span>
      </div>

      {/* Center dot */}
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
};

export default TargetCursor;

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CrosshairCursor = () => {
  const cursorRef = useRef(null);
  const cornersRef = useRef([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device supports hover (not touch)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    // Hide default cursor
    document.body.style.cursor = 'none';

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Track hoverable elements
    const handleElementHover = (e) => {
      const target = e.target.closest('a, button, [data-cursor-hover]');
      setIsHovering(!!target);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // GSAP animation loop for smooth following
    const ticker = gsap.ticker.add(() => {
      // Smooth interpolation
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;
      }
    });

    // Spinning animation
    const spinAnimation = gsap.to(cursorRef.current, {
      rotation: 360,
      duration: 8,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      gsap.ticker.remove(ticker);
      spinAnimation.kill();
    };
  }, []);

  // Hover animation
  useEffect(() => {
    if (!cursorRef.current) return;

    if (isHovering) {
      gsap.to(cornersRef.current, {
        scale: 1.5,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.02,
      });
      gsap.to(cursorRef.current, {
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(cornersRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.02,
      });
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isHovering]);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ willChange: 'transform' }}
    >
      {/* Crosshair lines */}
      <div className="relative w-10 h-10">
        {/* Horizontal line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white -translate-y-1/2" />
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white -translate-x-1/2" />

        {/* Corner brackets */}
        {/* Top-left */}
        <div
          ref={(el) => (cornersRef.current[0] = el)}
          className="absolute -top-2 -left-2 w-3 h-3 border-l-2 border-t-2 border-white"
          style={{ transformOrigin: 'bottom right' }}
        />
        {/* Top-right */}
        <div
          ref={(el) => (cornersRef.current[1] = el)}
          className="absolute -top-2 -right-2 w-3 h-3 border-r-2 border-t-2 border-white"
          style={{ transformOrigin: 'bottom left' }}
        />
        {/* Bottom-left */}
        <div
          ref={(el) => (cornersRef.current[2] = el)}
          className="absolute -bottom-2 -left-2 w-3 h-3 border-l-2 border-b-2 border-white"
          style={{ transformOrigin: 'top right' }}
        />
        {/* Bottom-right */}
        <div
          ref={(el) => (cornersRef.current[3] = el)}
          className="absolute -bottom-2 -right-2 w-3 h-3 border-r-2 border-b-2 border-white"
          style={{ transformOrigin: 'top left' }}
        />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};

export default CrosshairCursor;

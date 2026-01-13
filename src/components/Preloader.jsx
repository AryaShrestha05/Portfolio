import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    // gsap.context ensures clean rendering and no "double-run" bugs in React
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Fade out the overlay
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: onComplete, // This tells App.jsx to unmount the preloader
          });
        },
      });

      // The actual loading bar animation
      tl.to(progressRef.current, {
        scaleX: 1,
        duration: 2.5,
        ease: "expo.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* 200px wide track, 2px tall */}
      <div className="relative w-48 h-[2px] bg-foreground/10 overflow-hidden">
        {/* The filling bar */}
        <div
          ref={progressRef}
          className="absolute inset-0 bg-foreground origin-left"
          style={{ 
            transform: "scaleX(0)",
            backgroundColor: "var(--color-foreground)" 
          }}
        />
      </div>
    </div>
  );
};

export default Preloader;
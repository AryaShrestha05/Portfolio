import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // 1. Counter Animation
    const counterProxy = { value: 0 };
    tl.to(counterProxy, {
      value: 100,
      duration: 2.5,
      ease: "power2.out",
      onUpdate: () => setCount(Math.round(counterProxy.value)),
    });

    // 2. Fade out text
    tl.to(textRef.current, { opacity: 0, duration: 0.3 });

    // 3. Morph Circle to Navbar Shape
    // Navbar approximate shape: Top center, width ~400px, height ~50px, borderRadius full
    // We animate the circle div to that position
    tl.to(circleRef.current, {
      width: "420px", // Approximate navbar width
      height: "60px", // Approximate navbar height
      borderRadius: "9999px", // Keep it pill-shaped
      y: -window.innerHeight / 2 + 50, // Move to top (approximate from center)
      // Actually, better to use absolute positioning or Flip plugin, but let's approximate:
      top: "24px", // Top padding 
      left: "50%",
      xPercent: -50,
      yPercent: 0,
      position: "fixed",
      background: "rgba(255, 255, 255, 0.1)", // Match glassy look transitionally?
      backdropFilter: "blur(10px)",
      duration: 0.8,
      ease: "power4.inOut",
    }, "<"); // Start with fade out

    // 4. Fade out container background (reveal app behind, but beneath the pill?)
    // Actually, we want the pill to STAY as the navbar.
    // Since Preloader unmounts, we just need to line it up perfectly so the real navbar appears in its place.

    tl.to(containerRef.current, {
      backgroundColor: "transparent",
      duration: 0.5,
      delay: 0.2
    }, "<");

  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background text-foreground"
    >
      {/* The Morphing Circle */}
      {/* Initially a large circle holding the text */}
      <div
        ref={circleRef}
        className="relative flex items-center justify-center bg-transparent" // Start transparent or with a subtle bg? 
        // User wants "gooey circle graphic". Let's give it a background.
        // If theme is dark, maybe black or gold? Let's use the theme swticher logic... 
        // We'll trust CSS vars: bg-secondary or something.
        // Actually, let's make it a Gold/Black blob.
        style={{
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          // Gradient or solid?
          background: 'var(--color-primary, #888)', // Fallback
          // Let's use a class that adapts to theme:
          backgroundColor: 'var(--foreground)', // Contrast
        }}
      >
        <div className="absolute inset-0 rounded-full blur-xl opacity-20 bg-inherit" /> {/* Glow */}

        <div ref={textRef} className="flex flex-col items-center z-10 mix-blend-difference text-background">
          <h1 className="text-6xl font-bold tabular-nums">{count}%</h1>
          <p className="text-xs uppercase tracking-widest mt-2">Loading</p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;

import { useState, useEffect, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import { gsap } from 'gsap';

const AnimatedThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });
  const buttonRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = async (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate the maximum distance to any corner
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const maxRadius = Math.sqrt(maxX * maxX + maxY * maxY);

    const newTheme = theme === 'light' ? 'dark' : 'light';

    // Check if View Transitions API is supported
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(newTheme);
      });
    } else {
      // Fallback animation
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.left = `${x}px`;
        overlay.style.top = `${y}px`;
        overlay.style.backgroundColor = newTheme === 'dark' ? '#000000' : '#ffffff';

        gsap.fromTo(
          overlay,
          {
            scale: 0,
            opacity: 1,
          },
          {
            scale: maxRadius / 10,
            duration: 0.6,
            ease: 'power2.out',
            onStart: () => {
              overlay.style.display = 'block';
            },
            onComplete: () => {
              setTheme(newTheme);
              gsap.to(overlay, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                  overlay.style.display = 'none';
                },
              });
            },
          }
        );
      } else {
        setTheme(newTheme);
      }
    }

    // Button animation
    gsap.to(buttonRef.current, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });
  };

  return (
    <>
      {/* Circular transition overlay */}
      <div
        ref={overlayRef}
        className="fixed w-20 h-20 rounded-full pointer-events-none z-[9998]"
        style={{
          display: 'none',
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
        }}
      />

      <button
        ref={buttonRef}
        onClick={toggleTheme}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent overflow-hidden"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        data-cursor-hover
      >
        {/* Sun icon */}
        <Sun
          className={`absolute w-5 h-5 text-amber-500 transition-all duration-500 ${
            theme === 'dark'
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />

        {/* Moon icon */}
        <Moon
          className={`absolute w-5 h-5 text-blue-400 transition-all duration-500 ${
            theme === 'light'
              ? 'opacity-0 -rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
      </button>
    </>
  );
};

export default AnimatedThemeSwitcher;

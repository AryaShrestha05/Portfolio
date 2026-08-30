import { useRef, useEffect, useState } from 'react';
import AnimatedThemeSwitcher from './AnimatedThemeSwitcher';
import GlassSurface from './GlassSurface';
import './GooeyNav.css';

const GooeyNav = ({
  items = [
    { label: 'home', href: '#start-screen' },
    { label: 'about', href: '#about' },
    { label: 'experience', href: '#experience' },
    { label: 'projects', href: '#projects' },
    { label: 'beyond', href: '#beyond' },
    { label: 'contact', href: '#contacts' }
  ],
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
  onItemClick
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = (element) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e, index) => {
    e.preventDefault();
    const liEl = e.currentTarget;
    if (activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(liEl);

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    // Scroll Logic
    // Route through Lenis when it is running (see hooks/useSmoothScroll.js).
    // Native scrollIntoView sets scrollTop directly, which fights Lenis for
    // control of the same scroll and makes the jump stutter.
    const href = items[index].href;
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      if (window.__lenis) {
        window.__lenis.scrollTo(targetElement, { offset: -80, duration: 1.4 });
      } else {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (onItemClick) {
      onItemClick(href, index);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) {
        handleClick({ currentTarget: liEl }, index);
      }
    }
  };

  // Update effect position when activeIndex changes
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  // Track scroll position to update active section
  useEffect(() => {
    const sectionIds = items.map(item => item.href.substring(1));

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const newIndex = sectionIds.indexOf(sectionId);
          if (newIndex !== -1 && newIndex !== activeIndex) {
            setActiveIndex(newIndex);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [items, activeIndex]);

  // Mobile - just show theme switcher
  if (isMobile) {
    return (
      <GlassSurface
        width="auto"
        height="auto"
        borderRadius={50}
        backgroundOpacity={0.35}
        saturation={1}
        borderWidth={0.07}
        brightness={45}
        opacity={0.93}
        blur={11}
        displace={1.5}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        className="px-3 py-2"
      >
        <div className="cursor-target rounded-full">
          <AnimatedThemeSwitcher />
        </div>
      </GlassSurface>
    );
  }

  // Desktop - full navigation
  return (
    <GlassSurface
      width="auto"
      height="auto"
      borderRadius={50}
      backgroundOpacity={0.35}
      saturation={1}
      borderWidth={0.07}
      brightness={45}
      opacity={0.93}
      blur={11}
      displace={1.5}
      distortionScale={-180}
      redOffset={0}
      greenOffset={10}
      blueOffset={20}
      className="px-2 py-2"
    >
      <div className="gooey-nav-container flex items-center gap-4" ref={containerRef}>
        <nav>
          <ul ref={navRef} className="flex items-center">
            {items.map((item, index) => (
              <li key={item.label} className={activeIndex === index ? 'active' : ''} onClick={e => handleClick(e, index)}>
                <a
                  href={item.href}
                  className="cursor-target"
                  onClick={e => e.preventDefault()}
                  onKeyDown={e => handleKeyDown(e, index)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* "Ghost" elements for the effect must be relative to the container */}
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-2" />

        {/* Theme Switcher */}
        <div className="cursor-target rounded-full">
          <AnimatedThemeSwitcher />
        </div>
      </div>
    </GlassSurface>
  );
};

export default GooeyNav;

import { useRef } from 'react';
import { navLinks } from "../../constants/index.js";
import { gsap } from 'gsap';
import AnimatedThemeSwitcher from './AnimatedThemeSwitcher';
import GooeyNav from './GooeyNav';

const Navbar = () => {
  const navRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(navRef.current, {
      y: -5,
      scale: 1.01,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(navRef.current, {
      y: 0,
      scale: 1,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.10)',
      duration: 0.4,
      ease: 'power2.inOut'
    });
  };

  const handleNavigate = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav>
      <div
        id="navbar-gsap"
        ref={navRef}
        className="glass-card my-7 px-6 py-3 rounded-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <GooeyNav onNavigate={handleNavigate}>
          {(handleClick) => (
            <a
              href="#start-screen"
              onClick={(e) => {
                e.preventDefault();
                handleClick(e, '#start-screen');
              }}
              data-cursor-hover
            >
              <h1 className="text-2xl font-bold text-foreground hover:opacity-70 transition-opacity duration-300">
                home
              </h1>
            </a>
          )}
        </GooeyNav>

        <ul className="flex items-center">
          <GooeyNav onNavigate={handleNavigate} className="contents">
            {(handleClick) => (
              <>
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(e, `#${link.id}`);
                      }}
                      className="text-foreground hover:opacity-70 transition-opacity duration-300"
                      data-cursor-hover
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </>
            )}
          </GooeyNav>
          <li className="ml-4">
            <AnimatedThemeSwitcher />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

import { useRef } from 'react';
import { navLinks } from "../../constants/index.js";
import { gsap } from 'gsap';
import ThemeSwitcher from './ThemeSwitcher';

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

  return (
    <nav>
      <div
        id="navbar-gsap"
        ref={navRef}
        className="glass-card my-7 px-6 py-3 rounded-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a href="#start-screen">
          <h1 className="text-2xl font-bold text-foreground hover:opacity-70 transition-opacity duration-300">
            home
          </h1>
        </a>

        <ul className="flex items-center">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="text-foreground hover:opacity-70 transition-opacity duration-300"
              >
                {link.title}
              </a>
            </li>
          ))}
          <li className="ml-4">
            <ThemeSwitcher />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

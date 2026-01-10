import { useEffect, useRef } from 'react';
import { navLinks } from '/constants/index.js';
import { gsap } from 'gsap';

const Navbar = () => {
  const navRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(navRef.current, { y: -5, scale: 1.01, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)', duration: 0.4, ease: 'power2.out' });
  };
  
  const handleMouseLeave = () => {
    gsap.to(navRef.current, { y: 0, scale: 1, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', duration: 0.4, ease: 'power2.inOut' });
  };


  return (
    <nav>
      <div
        id='navbar-gsap'
        ref={navRef}
        className='bg-gradient-to-r from-black via-transparent to-black rounded-full my-7 px-6 py-3'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a href='#start-screen'>
          <h1 className='text-2xl text-gray-400 hover:text-amber-50 duration-300 font-bold'>
            Arya Shrestha
          </h1>
        </a>
        <ul>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} className='text-white hover:text-gray-300'>
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

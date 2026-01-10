import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import headshot from '../assets/photos/Arya_S_Headshot.jpg';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef();
  const aboutTextRef = useRef();
  const meTextRef = useRef();
  const cardRef = useRef();
  const imageCardRef = useRef();

  useEffect(() => {
    // 1. Initial Entrance Animation (Just for opacity/visibility)
    gsap.fromTo([aboutTextRef.current, meTextRef.current, cardRef.current, imageCardRef.current],
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 1, 
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );

    // 2. Scroll-based Parallax (STUCK TO SCROLL)
    // The cards will be at y: 0 when the section is in the center of the viewport
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom", // Animation starts when section enters bottom
        end: "bottom top",    // Animation ends when section leaves top
        scrub: 1,
      },
    });

    parallaxTl
      // Background text moves horizontally
      .fromTo(aboutTextRef.current, { x: 150 }, { x: -150, ease: "none" }, 0)
      .fromTo(meTextRef.current, { x: -150 }, { x: 150, ease: "none" }, 0)
      
      // Vertical card movement: 
      // Starts at 100px down, moves to -100px up. 
      // Result: At the exact center of the scroll, y is 0.
      .fromTo(cardRef.current, { y: 100 }, { y: -100, ease: "none" }, 0)
      .fromTo(imageCardRef.current, { y: 200 }, { y: -200, ease: "none" }, 0);
      
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen py-20 bg-transparent text-white flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Parallax Headers */}
      <div className="flex flex-col items-center mb-16 select-none pointer-events-none">
        <h3 
          ref={aboutTextRef} 
          className="text-9xl font-thin lowercase tracking-tighter whitespace-nowrap"
        >
          about
        </h3>
        <h3 
          ref={meTextRef} 
          className="text-9xl font-thin lowercase tracking-tighter whitespace-nowrap"
        >
          me
        </h3>
      </div>

      {/* Content Container */}
      <div className="container mx-auto max-w-6xl px-5">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left: Info Card */}
          <div 
            ref={cardRef} 
            className="flex-1 bg-gray-900/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 z-10"
          >
            <p className="text-white text-2xl font-semibold mb-6 lowercase">
              i'm arya, but i'm also:
            </p>
            
            <ul className="list-disc list-inside text-gray-300 text-lg space-y-4 leading-relaxed lowercase">
              <li>
                studying <span className="text-white font-medium">computer science</span> @ marist university, poughkeepsie ny.
              </li>
              <li>
                previous swe intern @ <span className="text-white font-medium">docere</span>, a lms platform educating underprivileged students in minnesota.
              </li>
              <li>
                working with louisiana attorneys to <span className="text-white font-medium">automate trust/will document creation</span>.
              </li>
              <li>
                tech fellow @ <span className="text-white font-medium">headstart fellowship</span>.
              </li>
              <li>
                phase 2 fellow @ <span className="text-white font-medium">propel2excel</span>.
              </li>
            </ul>
          </div>

          {/* Right: Image Card */}
          <div 
            ref={imageCardRef}
            className="flex-shrink-0 bg-gray-900/10 backdrop-blur-xl p-4 rounded-[3rem] border border-white/10 z-10"
          >
            <img 
              src={headshot} 
              alt="Arya Shrestha" 
              className="w-64 h-80 object-cover rounded-[2.5rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
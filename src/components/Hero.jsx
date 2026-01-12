import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const trigRef = useRef();
  const trigRefTwo = useRef();
  const btnRef = useRef();

  //GSAP Animations
  useEffect(() => {
    const textTop = gsap.timeline();
    const textBottom = gsap.timeline();
    const button = gsap.timeline();

    //Arya and Shrestha Entrance animations
    textTop.fromTo(
      trigRef.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1.5, ease: "power2.out" }
    );

    textBottom.fromTo(
      trigRefTwo.current,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1.5, ease: "power2.out" }
    );
    //Button entrance animation
    button.fromTo(
      btnRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
    );

    //Scroll-based animation for Arya and Shrestha
    const scrollAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=1500",
        scrub: 1,
      },
    });

    scrollAnimation.to(trigRef.current, { x: -300, ease: "none" }, 0)
      .to(trigRefTwo.current, { x: 300, ease: "none" }, 0);
  }, []);

  return (
    <>
      <section
        id="hero"
        className="min-h-screen bg-transparent text-black dark:text-white flex flex-col items-center justify-center space-y-10 overflow-hidden"
      >
        <h1
          ref={trigRef}
          className="text-9xl font-thin whitespace-nowrap"
        >
          Arya Arya Arya Arya Arya Arya Arya Arya Arya Arya
        </h1>
        <h1
          ref={trigRefTwo}
          className="text-9xl font-bold whitespace-nowrap"
        >
          Shrestha Shrestha Shrestha Shrestha Shrestha Shrestha
        </h1>
        <button
          ref={btnRef}
          className="flex-center bg-transparent border-2 border-amber-50 transition-smooth rounded-full px-8 py-2 text-2xl
          hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
        >
          resume
        </button>
      </section>
    </>
  );
};

export default Hero;

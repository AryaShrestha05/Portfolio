import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StartScreen = () => {
  const trigRef = useRef();
  const trigRefTwo = useRef();
  const btnRef = useRef();

  useEffect(() => {
    const textTop = gsap.timeline();
    const textBottom = gsap.timeline();
    const button = gsap.timeline();

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

    button.fromTo(
      btnRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
    );

    const scrollAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#start-screen",
        start: "top top",
        end: "+=1500",
        scrub: 1,
      },
    });

    scrollAnimation.to(trigRef.current, { x: -300, ease: "none" }, 0)
      .to(trigRefTwo.current, { x: 300, ease: "none" }, 0);
  }, []);

  return (
    <section
      id="start-screen"
      className="min-h-screen w-full flex flex-col items-center justify-center space-y-10 overflow-hidden"
    >
      <h1
        ref={trigRef}
        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-thin whitespace-nowrap text-foreground transition-colors duration-300"
      >
        Arya Arya Arya Arya Arya Arya Arya Arya Arya Arya
      </h1>
      <h1
        ref={trigRefTwo}
        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold whitespace-nowrap text-foreground transition-colors duration-300"
      >
        Shrestha Shrestha Shrestha Shrestha Shrestha Shrestha
      </h1>
      <button
        ref={btnRef}
        className="btn-outline text-xl sm:text-2xl"
      >
        resume
      </button>
    </section>
  );
};

export default StartScreen;

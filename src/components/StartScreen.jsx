import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RotatingText from './RotatingText';
import ResumeModal from './ResumeModal';

gsap.registerPlugin(ScrollTrigger);

const StartScreen = () => {
  const trigRef = useRef();
  const trigRefTwo = useRef();
  const btnRef = useRef();
  const subtitleRef = useRef();
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const textTop = gsap.timeline();
    const textBottom = gsap.timeline();
    const button = gsap.timeline();
    const subtitle = gsap.timeline();

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

    subtitle.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.5 }
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
      /* Added font-primary class here to cover the whole section */
      className="min-h-screen w-full flex flex-col items-center justify-center space-y-6 overflow-hidden font-primary"
    >
      {/* Main name display */}
      <h1
        ref={trigRef}
        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-thin whitespace-nowrap text-foreground transition-colors duration-300 hero-text"
      >
        Arya Arya Arya Arya Arya Arya Arya Arya Arya Arya
      </h1>
      <h1
        ref={trigRefTwo}
        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold whitespace-nowrap text-foreground transition-colors duration-300 hero-text"
      >
        Shrestha Shrestha Shrestha Shrestha Shrestha Shrestha
      </h1>

      {/* Rotating subtitle */}
      <div ref={subtitleRef} className="text-xl sm:text-2xl text-muted-foreground mt-4">
        <RotatingText
          texts={[
            'im a software engineer',
            'im a full-stack developer',
            'im a problem solver',
            'im a tech enthusiast',
            'im Arya!'
          ]}
          interval={2500}
          className="text-foreground font-semibold"
          splitBy="character"
        />
      </div>

      {/* CTA Button */}
      <button
        ref={btnRef}
        className="btn-outline text-xl sm:text-2xl mt-8 font-primary"
        data-cursor-hover
        /* Corrected style syntax to use the CSS variable properly */
        style={{ fontFamily: 'var(--font-primary)' }}
        onClick={() => setIsResumeOpen(true)}
      >
        resume
      </button>

      {/* Resume Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </section>
  );
};

export default StartScreen;
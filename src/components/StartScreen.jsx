import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MQ, SCRUB, EASE_SOFT, DURATION } from '../lib/motion';
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
    const mm = gsap.matchMedia();

    mm.add(MQ, (context) => {
      const { isDesktop, reduce } = context.conditions;
      const targets = [trigRef.current, trigRefTwo.current, subtitleRef.current, btnRef.current];

      // Reduced motion: everything lands in its final state immediately.
      if (reduce) {
        gsap.set(targets, { clearProps: 'all', opacity: 1, x: 0, y: 0 });
        return;
      }

      // Entrance. The two name rows arrive from opposite sides, then settle
      // into a slow counter-drift that keeps the hero alive while idle.
      gsap
        .timeline()
        .fromTo(
          trigRef.current,
          { opacity: 0, x: 150 },
          { opacity: 1, x: 0, duration: 0.9, ease: EASE_SOFT }
        )
        .to(trigRef.current, {
          x: 15,
          duration: 3.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

      gsap
        .timeline()
        .fromTo(
          trigRefTwo.current,
          { opacity: 0, x: -150 },
          { opacity: 1, x: 0, duration: 0.9, ease: EASE_SOFT }
        )
        .to(trigRefTwo.current, {
          x: -15,
          duration: 3.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: DURATION, ease: EASE_SOFT, delay: 0.45 }
      );

      gsap.fromTo(
        btnRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: DURATION, ease: EASE_SOFT, delay: 0.65 }
      );

      // On scroll the two rows pull apart, opening the page beneath them.
      const exit = isDesktop ? 300 : 100;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '#start-screen',
            start: 'top top',
            end: isDesktop ? '+=1500' : '+=1000',
            scrub: SCRUB,
          },
        })
        .to(trigRef.current, { x: -exit, ease: 'none' }, 0)
        .to(trigRefTwo.current, { x: exit, ease: 'none' }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="start-screen"
      /* Added font-primary class here to cover the whole section */
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center space-y-6 overflow-hidden font-primary"
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
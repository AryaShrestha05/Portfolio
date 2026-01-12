import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Beyond = () => {
  const sectionRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1
        }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="beyond"
      className="min-h-screen py-20 px-5 flex items-center justify-center"
    >
      <div ref={contentRef} className="w-full max-w-4xl">
        <h2 className="text-5xl font-bold text-center mb-12 text-foreground">
          Beyond
        </h2>
        <div className="glass-card p-8">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Additional information about you will go here.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Beyond;

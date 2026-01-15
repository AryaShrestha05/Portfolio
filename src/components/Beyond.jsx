import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Beyond = () => {
  const sectionRef = useRef();
  const beyondTheRef = useRef();
  const classroomRef = useRef();
  const photoRefs = useRef([]);

  const photoData = [
    { src: "", desc: "Basketball" },
    { src: "", desc: "Hackathons" },
    { src: "", desc: "Gym" },
    { src: "", desc: "Food" },
    { src: "", desc: "Nepal" },
    { src: "", desc: "Music" },
  ];

  useEffect(() => {
    // Title entrance animation
    gsap.fromTo(
      [beyondTheRef.current, classroomRef.current],
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

    // Parallax timeline for split title animation
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    parallaxTl
      .fromTo(beyondTheRef.current, { x: 150 }, { x: -150, ease: "none" }, 0)
      .fromTo(classroomRef.current, { x: -150 }, { x: 150, ease: "none" }, 0);

    // Reveal animation for photos
    gsap.fromTo(
      photoRefs.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="beyond"
      className="min-h-screen py-20 md:py-32 flex flex-col items-center relative overflow-hidden"
    >
      {/* Split Title with parallax - full width */}
      <div className="w-full flex flex-col items-center mb-12 md:mb-16 select-none pointer-events-none">
        <h2 ref={beyondTheRef} className="section-title text-6xl sm:text-7xl md:text-9xl !leading-[0.7]">
          beyond
        </h2>
        <h2 ref={classroomRef} className="section-title text-6xl sm:text-7xl md:text-9xl mt-3 md:mt-5 !leading-[0.9]">
          classroom
        </h2>
      </div>

      {/* Photo Grid - 6 square photos */}
      <div className="z-10 w-full max-w-5xl px-5 sm:px-8 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {photoData.map((item, i) => (
            <div
              key={i}
              ref={el => photoRefs.current[i] = el}
              className="group relative aspect-square overflow-hidden cursor-pointer rounded-xl md:rounded-2xl border border-border"
            >
              {/* Image - fills entire card */}
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.desc}
                  className="w-full h-full object-cover bg-muted transition-all duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}

              {/* Overlay with Description - visible on mobile, hover on desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent md:bg-background/90 md:backdrop-blur-sm md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex items-end md:items-center justify-center p-3 md:p-4 rounded-xl md:rounded-2xl">
                <p className="font-sans text-[10px] sm:text-xs md:text-sm tracking-wide text-foreground text-center md:text-center">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Beyond;
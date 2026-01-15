import { useEffect, useRef } from 'react';
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
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Desktop Animations
      gsap.fromTo(
        [aboutTextRef.current, meTextRef.current, cardRef.current, imageCardRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      tl.fromTo(aboutTextRef.current, { x: 150 }, { x: -150, ease: "none" }, 0)
        .fromTo(meTextRef.current, { x: -150 }, { x: 150, ease: "none" }, 0)
        .fromTo(cardRef.current, { y: 40 }, { y: -40, ease: "none" }, 0)
        .fromTo(imageCardRef.current, { y: 80 }, { y: -80, ease: "none" }, 0);
    });

    mm.add("(max-width: 767px)", () => {
      // Mobile Animations: Reduced movement to prevent horizontal scroll issues
      gsap.fromTo(
        [aboutTextRef.current, meTextRef.current, cardRef.current, imageCardRef.current],
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      tl.fromTo(aboutTextRef.current, { x: 40 }, { x: -40, ease: "none" }, 0)
        .fromTo(meTextRef.current, { x: -40 }, { x: 40, ease: "none" }, 0)
        .fromTo(cardRef.current, { y: 20 }, { y: -20, ease: "none" }, 0)
        .fromTo(imageCardRef.current, { y: 30 }, { y: -30, ease: "none" }, 0);
    });

    return () => mm.revert(); // Cleanup
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen py-16 md:py-20 flex flex-col items-center justify-center md:justify-end overflow-hidden relative"
    >
      {/* Parallax Headers */}
      <div className="absolute top-[8%] md:top-[10%] flex flex-col items-center select-none pointer-events-none z-0">
        <h3 ref={aboutTextRef} className="section-title !leading-[0.7] text-7xl md:text-9xl will-change-transform">
          about
        </h3>
        <h3 ref={meTextRef} className="section-title !leading-[0.9] text-7xl md:text-9xl ml-12 md:ml-0 shadow-text will-change-transform">
          me
        </h3>
      </div>

      {/* Content Container */}
      <div className="w-full max-w-6xl px-6 z-10 mt-24 md:mt-0 pb-10 md:pb-15">
        <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-8 items-center md:items-end justify-center">
          
          {/* Left: Info Card */}
          <div ref={cardRef} className="w-full md:flex-1 glass-card p-6 md:p-10 will-change-transform">
            <p className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 lowercase text-foreground">
              i'm arya, but i'm also:
            </p>

            <ul className="list-disc list-inside text-base md:text-lg space-y-3 md:space-y-4 leading-relaxed lowercase text-muted-foreground font-sans">
              <li>studying <span className="text-foreground font-medium">computer science</span> @ marist university.</li>
              <li>previous swe intern @ <span className="text-foreground font-medium">docere</span>.</li>
              <li>automating <span className="text-foreground font-medium">trust/will docs</span> for attorneys.</li>
              <li>tech fellow @ <span className="text-foreground font-medium">headstart</span>.</li>
              <li>phase 2 fellow @ <span className="text-foreground font-medium">propel2excel</span>.</li>
            </ul>
          </div>

          {/* Right: Image Card */}
          <div ref={imageCardRef} className="flex-shrink-0 glass-card p-3 md:p-4 will-change-transform">
            <img
              src={headshot}
              alt="Arya Shrestha"
              className="w-48 h-60 md:w-56 md:h-72 object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
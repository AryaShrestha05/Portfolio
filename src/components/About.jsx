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
    // Initial Fade In
    gsap.fromTo(
      [aboutTextRef.current, meTextRef.current, cardRef.current, imageCardRef.current],
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

    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    parallaxTl
      .fromTo(aboutTextRef.current, { x: 150 }, { x: -150, ease: "none" }, 0)
      .fromTo(meTextRef.current, { x: -150 }, { x: 150, ease: "none" }, 0)
      .fromTo(cardRef.current, { y: 40 }, { y: -40, ease: "none" }, 0)
      .fromTo(imageCardRef.current, { y: 80 }, { y: -80, ease: "none" }, 0);

  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen py-20 flex flex-col items-center justify-end overflow-hidden relative"
    >
      {/* Parallax Headers - Positioned higher up at 10% */}
      <div className="absolute top-[10%] flex flex-col items-center select-none pointer-events-none z-0">
        <h3 
          ref={aboutTextRef} 
          className="section-title !leading-[0.7]"
        >
          about
        </h3>
        <h3 
          ref={meTextRef} 
          className="section-title !leading-[0.9]"
        >
          me
        </h3>
      </div>

      {/* Content Container - Pushed to the bottom half with pb-32 */}
      <div className="w-full max-w-6xl px-5 z-10 pb-15">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-end justify-center">
          
          {/* Left: Info Card */}
          <div 
            ref={cardRef} 
            className="flex-1 glass-card p-8 md:p-10"
          >
            <p className="text-2xl font-semibold mb-6 lowercase text-foreground">
              i'm arya, but i'm also:
            </p>

            <ul className="list-disc list-inside text-lg space-y-4 leading-relaxed lowercase text-muted-foreground font-sans">
              <li>
                studying <span className="text-foreground font-medium">computer science</span> @ marist university, poughkeepsie ny.
              </li>
              <li>
                previous swe intern @ <span className="text-foreground font-medium">docere</span>, a startup educating underprivileged students in minnesota.
              </li>
              <li>
                working with louisiana attorneys to <span className="text-foreground font-medium">automate trust/will document creation</span>.
              </li>
              <li>
                tech fellow @ <span className="text-foreground font-medium">headstart fellowship</span>.
              </li>
              <li>
                phase 2 fellow @ <span className="text-foreground font-medium">propel2excel</span>.
              </li>
            </ul>
          </div>

          {/* Right: Image Card */}
          <div 
            ref={imageCardRef} 
            className="flex-shrink-0 glass-card p-4"
          >
            <img
              src={headshot}
              alt="Arya Shrestha"
              className="w-56 h-72 object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
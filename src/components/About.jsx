import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MQ, SCRUB, EASE_SOFT, DURATION, STAGGER } from '../lib/motion';
import headshot from '../assets/photos/Arya_S_Headshot.jpg';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef();
  const aboutTextRef = useRef();
  const meTextRef = useRef();
  const cardRef = useRef();
  const imageCardRef = useRef();

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ, (context) => {
      const { isDesktop, reduce } = context.conditions;
      const targets = [aboutTextRef.current, meTextRef.current, cardRef.current, imageCardRef.current];

      if (reduce) {
        gsap.set(targets, { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y: isDesktop ? 24 : 16 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION,
          stagger: STAGGER,
          ease: EASE_SOFT,
          scrollTrigger: { trigger: sectionRef.current, start: isDesktop ? 'top 70%' : 'top 80%' },
        }
      );

      // Counter-drifting title halves plus a slower card layer. Three speeds
      // read as depth; the image moves most because it is nearest the eye.
      const titleDrift = isDesktop ? 150 : 40;
      const cardDrift = isDesktop ? 40 : 18;
      const imageDrift = isDesktop ? 80 : 28;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: SCRUB,
          },
        })
        .fromTo(aboutTextRef.current, { x: titleDrift }, { x: -titleDrift, ease: 'none' }, 0)
        .fromTo(meTextRef.current, { x: -titleDrift }, { x: titleDrift, ease: 'none' }, 0)
        .fromTo(cardRef.current, { y: cardDrift }, { y: -cardDrift, ease: 'none' }, 0)
        .fromTo(imageCardRef.current, { y: imageDrift }, { y: -imageDrift, ease: 'none' }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-[100dvh] py-20 md:py-24 flex flex-col items-center justify-center md:justify-end overflow-hidden relative"
    >
      {/* Parallax Headers */}
      <div className="absolute top-[12%] md:top-[10%] flex flex-col items-center select-none pointer-events-none z-0">
        <h3 ref={aboutTextRef} className="section-title !leading-[0.7] will-change-transform">
          about
        </h3>
        <h3 ref={meTextRef} className="section-title !leading-[0.9] ml-8 lg:ml-0 will-change-transform">
          me
        </h3>
      </div>

      {/* Content Container */}
      <div className="w-full max-w-6xl px-5 sm:px-8 md:px-6 z-10 mt-32 md:mt-0 pb-10 md:pb-15">
        <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-8 items-center md:items-end justify-center">
          
          {/* Left: Info Card */}
          <div ref={cardRef} className="w-full md:flex-1 glass-card p-6 md:p-10 will-change-transform">
            <p className="text-xl md:text-2xl font-semibold mb-5 md:mb-7 lowercase text-foreground">
              i'm arya, but i'm also:
            </p>

            <ul className="text-base md:text-lg space-y-3 md:space-y-4 leading-relaxed lowercase text-muted-foreground font-sans">
              {[
                <>studying <span className="text-foreground font-medium">computer science and cybersecurity</span> @ marist university.</>,
                <><span className="text-foreground font-medium">undergraduate research assistant</span> building network protocols in c.</>,
                <>previous swe intern @ <span className="text-foreground font-medium">advocacy financial</span>.</>,
                <>automating <span className="text-foreground font-medium">trust and will docs</span> for attorneys.</>,
                <>tech fellow @ <span className="text-foreground font-medium">headstart</span>, phase 2 fellow @ <span className="text-foreground font-medium">propel2excel</span>.</>,
              ].map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[11px] h-[3px] w-[3px] flex-shrink-0 rounded-full bg-muted-foreground"
                  />
                  <span>{line}</span>
                </li>
              ))}
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
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import docereLogo from '../assets/photos/docere.jpeg';
import maristLogo from '../assets/photos/marist.jpeg';
import headstartLogo from '../assets/photos/headstart.jpeg';
import propelLogo from '../assets/photos/propel2excel.jpeg';
import colorstackLogo from '../assets/photos/colorstack.jpeg';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef();
  const experienceTextRef = useRef();
  const sliderRef = useRef();
  const pinContainerRef = useRef();
  const cardsRef = useRef([]);

  useEffect(() => {
    const slider = sliderRef.current;
    const cards = cardsRef.current;

    gsap.fromTo(
      [experienceTextRef.current, sliderRef.current],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );

    gsap.fromTo(
      experienceTextRef.current,
      { x: -250 },
      {
        x: 250,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: () => `+=${slider.scrollWidth + window.innerHeight}`,
          scrub: 1,
        }
      }
    );

    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: pinContainerRef.current,
        start: "top top",
        end: () => `+=${slider.scrollWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    pinTl.to(slider, {
      x: () => -(slider.scrollWidth - window.innerWidth),
      ease: "none",
    });

    gsap.set(cards, { scale: 0.6, opacity: 0 });

    cards.forEach((card) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: card,
          containerAnimation: pinTl,
          start: "left 95%",
          end: "right 5%",
          scrub: true,
        }
      })
        .to(card, { opacity: 1, scale: 0.85, ease: "power2.inOut" })
        .to(card, { opacity: 0, scale: 0.6, ease: "power2.inOut" });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const items = [
    {
      role: 'software engineer intern',
      company: 'docere',
      logo: docereLogo,
      period: 'jun 2025 – sep 2025',
      points: [
        'shipped ai learning platform for 50+ users',
        'designed rest apis for ai tutoring pipelines',
        'built automated notification systems'
      ]
    },
    {
      role: 'lms quality developer',
      company: 'marist university',
      logo: maristLogo,
      period: 'apr 2025 – present',
      isMarist: true,
      points: [
        'developed 150+ page digital education site',
        'audited 3,000+ courses for wcag ',
        'resolved platform issues via jira'
      ]
    },
    {
      role: 'tech fellow',
      company: 'headstart fellowship',
      logo: headstartLogo,
      period: 'july 2025 – dec 2025',
      points: [
        'collaborated on community tech growth',
        'participated in technical leadership tracks',
        'engaged in agile-driven sprint cycles'
      ]
    },
    {
      role: 'phase 2 fellow',
      company: 'propel2excel',
      logo: propelLogo,
      period: '2025',
      points: [
        'advanced to specialized fellowship phase',
        'mastered full-stack architecture patterns',
        'built scalable project deployments'
      ]
    },
    {
      role: 'colorstack fellow',
      company: 'colorstack',
      logo: colorstackLogo,
      period: '2025',
      points: [
        'engaged in black/latinx tech community',
        'utilized career development resources',
        'participated in technical workshops'
      ]
    },
  ];

  return (
    <section ref={sectionRef} id="experience" className="relative overflow-hidden">
      <div ref={pinContainerRef} className="h-screen w-full flex flex-col items-center justify-center">
        {/* Background Title */}
        <div className="absolute top-[15vh] w-full flex justify-center z-0 pointer-events-none">
          <h3 ref={experienceTextRef} className="section-title">
            experience
          </h3>
        </div>

        {/* Cards Slider */}
        <div className="w-full flex items-center relative z-10 mt-[10vh]">
          <div
            ref={sliderRef}
            className="flex items-center"
            style={{
              width: 'max-content',
              paddingLeft: 'calc(50vw - 200px)',
              paddingRight: '50vw'
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="flex-shrink-0 w-[350px] md:w-[400px] h-[420px] glass-card p-10 flex flex-col shadow-xl rounded-3xl"
              >
                {/* Logo Section */}
                <div className="w-16 h-16 mb-6 flex items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
                  <img
                    src={item.logo}
                    alt={item.company}
                    className={`w-full h-full object-cover ${item.isMarist ? 'scale-110' : ''}`}
                  />
                </div>

                {/* Company Name */}
                <h4 className="text-3xl font-bold mb-1 text-foreground">
                  {item.company}
                </h4>

                {/* Role & Period */}
                <p className="text-[13px] font-semibold mb-6 uppercase tracking-widest text-muted-foreground">
                  {item.role} • {item.period}
                </p>

                {/* Points */}
                <ul className="space-y-3 mb-6">
                  {item.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-xl mt-[-6px] text-foreground">•</span>
                      <p className="text-[15px] leading-snug font-light lowercase text-foreground">
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <button className="btn text-[11px] font-bold uppercase tracking-tighter">
                    my team
                  </button>
                  <button className="btn text-[11px] font-bold uppercase tracking-tighter">
                    my project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

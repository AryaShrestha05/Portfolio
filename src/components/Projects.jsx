import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef();
  const backgroundTextRef = useRef();
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );

    gsap.fromTo(
      backgroundTextRef.current,
      { x: 150 },
      {
        x: -150,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      }
    );

    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 50 * (index + 1) },
        {
          y: -50 * (index + 1),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const projectList = [
    {
      title: "Docere LMS",
      desc: "swe intern // lms platform for underprivileged students.",
      tags: ["React", "Node.js", "Firebase"]
    },
    {
      title: "Legal Automation",
      desc: "automating trust/will document creation for attorneys.",
      tags: ["Python", "Automation", "LegalTech"]
    },
    {
      title: "Headstart Hub",
      desc: "tech fellowship platform for community growth.",
      tags: ["GSAP", "Tailwind", "Next.js"]
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="min-h-screen py-32 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background Parallax Header */}
      <div className="absolute top-[10%] w-full flex justify-center z-0 pointer-events-none">
        <h3 ref={backgroundTextRef} className="section-title">
          projects
        </h3>
      </div>

      {/* Project Cards */}
      <div className="w-full max-w-6xl px-5 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectList.map((project, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="glass-card p-8 hover:border-accent/50 transition-colors duration-500 group"
            >
              {/* Accent Line */}
              <div className="h-1 w-12 bg-accent rounded-full mb-8 group-hover:w-20 transition-all duration-500" />

              {/* Project Title */}
              <h4 className="text-3xl font-light lowercase tracking-tight mb-4 text-foreground opacity-90">
                {project.title}
              </h4>

              {/* Project Description */}
              <p className="text-sm leading-relaxed mb-8 lowercase text-muted-foreground">
                {project.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-border text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

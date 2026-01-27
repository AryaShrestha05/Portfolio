import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import llaPreview from '../assets/projectPreviews/llaPreview.gif';
import posturizePreview from '../assets/projectPreviews/posturizePreview.gif';
import regressionPreview from '../assets/projectPreviews/regressionModel.png';
import mojitoPreview from '../assets/projectPreviews/mojitoPreview.gif';
import rateLimiterPreview from '../assets/projectPreviews/rateLimiterPreview.gif';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef();
  const backgroundTextRef = useRef();
  const cardsRef = useRef([]);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Desktop animations
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );

      // Background Text Parallax
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

      // Individual Card Parallax - capped for consistency
      cardsRef.current.forEach((card, index) => {
        const offset = Math.min(30 * (index + 1), 60);
        gsap.fromTo(
          card,
          { y: offset },
          {
            y: -offset,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            }
          }
        );
      });
    });

    mm.add("(max-width: 1023px)", () => {
      // Mobile animations - reduced parallax to prevent overflow
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

      // Background Text Parallax - reduced for mobile
      gsap.fromTo(
        backgroundTextRef.current,
        { x: 50 },
        {
          x: -50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        }
      );

      // Individual Card Parallax - smaller on mobile
      cardsRef.current.forEach((card, index) => {
        const offset = Math.min(15 * (index + 1), 30);
        gsap.fromTo(
          card,
          { y: offset },
          {
            y: -offset,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            }
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  const projectList = [
    {
      title: "legacy louisiana",
      subtitle: "legal automation // jul – dec 2025",
      description: [
        "full-stack app automating trust/will creation for louisiana attorneys",
        "projected 95% workload reduction — 6 hours to under 30 minutes",
        "scalable architecture supporting growth from 60 to 1000+ users"
      ],
      tags: ["Node.js", "Express", "PostgreSQL", "React"],
      gif: llaPreview,
      liveUrl: "https://legacylouisiana.vercel.app/",
      codeUrl: "https://github.com/AryaShrestha05/legacylouisiana"
    },
    {
      title: "distributed rate limiter",
      subtitle: "distributed systems // jan 2026",
      description: [
        "distributed rate limiting with redis for consistent multi-server enforcement",
        "containerized microservices with docker and nginx for horizontal scaling",
        "real-time observability dashboard with react and express"
      ],
      tags: ["JavaScript", "Redis", "Nginx", "Docker", "React", "Express"],
      gif: rateLimiterPreview,
      codeUrl: "https://github.com/AryaShrestha05/rateLimiter",
      imageScale: 1.25
    },
    {
      title: "posturize",
      subtitle: "hackprinceton // nov 2025",
      description: [
        "real-time posture analysis system built in under 36 hours",
        "opencv + mediapipe for vision-based pose detection",
        "d3.js visualizations for instant user feedback"
      ],
      tags: ["React", "Flask", "OpenCV", "MediaPipe"],
      gif: posturizePreview,
      liveUrl: "https://posturize-beta.vercel.app/",
      codeUrl: "https://github.com/AryaShrestha05/posturize"
    },
    {
      title: "grab a mojito",
      subtitle: "interactive web app // 2025",
      description: [
        "bar app with smooth scroll-based animations",
        "built custom gsap transitions for seamless ui",
        "responsive design, dynamic filtering and search"
      ],
      tags: ["React", "JavaScript", "GSAP"],
      gif: mojitoPreview,
      liveUrl: "https://grabamojito.vercel.app/",
      codeUrl: "https://github.com/AryaShrestha05/grabamojito"
    },
    {
      title: "polynomial regression",
      subtitle: "ml from scratch // dec 2024 – jan 2025",
      description: [
        "built regression algorithm predicting housing prices on 5000+ data points",
        "implemented gradient descent, improving accuracy by 15%",
        "feature-engineered variables for better model performance"
      ],
      tags: ["Python", "NumPy", "Matplotlib"],
      gif: regressionPreview,
      codeUrl: "#"
    }
  ];

  return (
    <section ref={sectionRef} id="projects" className="min-h-screen py-20 md:py-32 flex flex-col items-center relative overflow-hidden">
      {/* Title - relative on mobile, absolute on desktop */}
      <div className="w-full flex justify-center z-0 pointer-events-none mb-8 md:mb-0 md:absolute md:top-[3.5%]">
        <h3 ref={backgroundTextRef} className="section-title text-5xl sm:text-6xl md:text-7xl lg:text-9xl">projects</h3>
      </div>

      <div className="w-full max-w-5xl px-5 sm:px-8 md:px-6 z-10 md:mt-24">
        <div className="flex flex-col gap-8 md:gap-12">
          {projectList.map((project, index) => (
            <div key={project.title} ref={el => cardsRef.current[index] = el} className="glass-card p-5 sm:p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-8">
              <div className="md:w-2/5 flex-shrink-0 flex flex-col">
                <div className="aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden border border-border bg-muted">
                  <img src={project.gif} alt={project.title} className="w-full h-full object-cover" style={project.imageScale ? { transform: `scale(${project.imageScale})` } : undefined} />
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3 mt-3 md:mt-4">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                       className="btn cursor-target text-[10px] md:text-[11px] font-bold uppercase tracking-tighter"
                       data-cursor-text="Open">
                      live demo
                    </a>
                  )}
                  {project.codeUrl && (
                    <a href={project.codeUrl} target="_blank" rel="noopener noreferrer"
                       className="btn cursor-target text-[10px] md:text-[11px] font-bold uppercase tracking-tighter"
                       data-cursor-text="GitHub">
                      view code
                    </a>
                  )}
                </div>
              </div>

              <div className="md:w-3/5 flex flex-col">
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2 text-foreground lowercase">{project.title}</h4>
                <p className="text-xs md:text-sm font-semibold mb-4 md:mb-6 uppercase tracking-widest text-muted-foreground">{project.subtitle}</p>
                <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6 flex-grow font-sans">
                  {project.description.map((point, i) => (
                    <li key={`${project.title}-desc-${i}`} className="flex items-start gap-2 md:gap-3">
                      <span className="text-lg md:text-xl mt-[-3px] md:mt-[-4px] text-foreground">•</span>
                      <p className="text-sm md:text-base leading-relaxed font-light lowercase text-muted-foreground">{point}</p>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[9px] md:text-[10px] uppercase tracking-widest px-2 md:px-3 py-1 rounded-full border border-border text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
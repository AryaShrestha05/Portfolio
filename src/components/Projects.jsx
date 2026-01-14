import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import llaPreview from '../assets/projectPreviews/llaPreview.gif';
import posturizePreview from '../assets/projectPreviews/posturizePreview.gif';
import regressionPreview from '../assets/projectPreviews/regressionModel.png';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef();
  const backgroundTextRef = useRef();
  const cardsRef = useRef([]);

  useEffect(() => {
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
        { y: 40 * (index + 1) },
        {
          y: -40 * (index + 1),
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
      title: "posturize",
      subtitle: "hackprinceton // nov 2025",
      description: [
        "real-time posture analysis system built in under 36 hours",
        "opencv + mediapipe for vision-based pose detection",
        "d3.js visualizations for instant user feedback"
      ],
      tags: ["React", "Flask", "OpenCV", "MediaPipe"],
      gif: posturizePreview,
      liveUrl: "#",
      codeUrl: "#"
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
    <section
      ref={sectionRef}
      id="projects"
      className="min-h-screen py-32 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background Title */}
      <div className="absolute top-[5%] w-full flex justify-center z-0 pointer-events-none">
        <h3 ref={backgroundTextRef} className="section-title">
          projects
        </h3>
      </div>

      {/* Cards Container */}
      <div className="w-full max-w-5xl px-5 z-10 mt-24">
        <div className="flex flex-col gap-12">
          {projectList.map((project, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="glass-card p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8"
            >
              {/* Left Section - Preview + Buttons */}
              <div className="md:w-2/5 flex-shrink-0 flex flex-col">
                {/* Image - 16:9 aspect ratio */}
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border bg-muted">
                  <img
                    src={project.gif}
                    alt={`${project.title} preview`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Action Buttons - Under preview */}
                <div className="flex gap-3 mt-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn text-[11px] font-bold uppercase tracking-tighter"
                    >
                      live demo
                    </a>
                  )}
                  {project.codeUrl && (
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn text-[11px] font-bold uppercase tracking-tighter"
                    >
                      view code
                    </a>
                  )}
                </div>
              </div>

              {/* Right Section - Content */}
              <div className="md:w-3/5 flex flex-col">
                {/* Title */}
                <h4 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                  {project.title}
                </h4>

                {/* Subtitle */}
                <p className="text-sm font-semibold mb-6 uppercase tracking-widest text-muted-foreground">
                  {project.subtitle}
                </p>

                {/* Description Points */}
                <ul className="space-y-3 mb-6 flex-grow font-sans">
                  {project.description.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-xl mt-[-4px] text-foreground">•</span>
                      <p className="text-base leading-relaxed font-light lowercase text-muted-foreground">
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>

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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

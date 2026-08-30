import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { MQ, SCRUB, EASE_SOFT, DURATION, STAGGER } from '../lib/motion';
import ProjectPreview from './ProjectPreview';

import llaVideo from '../assets/projectPreviews/llaPreview.mp4';
import llaPoster from '../assets/projectPreviews/llaPreview.poster.jpg';
import posturizeVideo from '../assets/projectPreviews/posturizePreview.mp4';
import posturizePoster from '../assets/projectPreviews/posturizePreview.poster.jpg';
import mojitoVideo from '../assets/projectPreviews/mojitoPreview.mp4';
import mojitoPoster from '../assets/projectPreviews/mojitoPreview.poster.jpg';
import rateLimiterVideo from '../assets/projectPreviews/rateLimiterPreview.mp4';
import rateLimiterPoster from '../assets/projectPreviews/rateLimiterPreview.poster.jpg';
import regressionImage from '../assets/projectPreviews/regressionModel.jpg';

gsap.registerPlugin(ScrollTrigger);

/**
 * `variant` drives layout, not styling:
 *   lead - full-width split, image left. Used once, for the flagship build.
 *   wide - spans both grid columns, wide crop on top, copy in two columns.
 *   (default) - single grid column, image on top.
 *
 * Mixing the three stops eight projects from reading as eight identical rows.
 * Projects without a `gif` render a typographic placeholder panel; drop a
 * capture into assets/projectPreviews and add `gif` to swap it in.
 */
const projectList = [
  {
    title: 'legacy louisiana',
    subtitle: 'legal automation platform',
    context: 'built during my advocacy financial internship',
    variant: 'lead',
    description: [
      'full-stack platform digitizing estate and succession workflows for 60+ attorneys',
      'cut document prep time 40%, from roughly 6 hours to under 30 minutes',
      '55-table multi-tenant architecture with 3-tier access across 86 api endpoints',
    ],
    tags: ['Node.js', 'Express', 'PostgreSQL', 'React', 'JWT', 'Jest'],
    video: llaVideo,
    poster: llaPoster,
    liveUrl: 'https://legacylouisiana.vercel.app/',
    codeUrl: 'https://github.com/AryaShrestha05/legacylouisiana',
  },
  {
    title: 'room foxes',
    subtitle: 'roommate matching, ios and android',
    variant: 'wide',
    description: [
      'roommate matching platform serving 200+ students across ios and android',
      '12-attribute compatibility engine reaching 80% match satisfaction in user surveys',
      'mixpanel tracking on 15+ events per session, improving day-7 retention 35%',
      'aws-hosted postgresql with connection pooling and indexed queries, 40% faster loads',
    ],
    tags: ['React Native', 'Expo', 'Node.js', 'Express', 'PostgreSQL', 'AWS RDS', 'Mixpanel'],
  },
  {
    title: 'docere',
    subtitle: 'ai learning platform',
    description: [
      'rag pipeline injecting lesson context per prompt, improving relevance 40% for 100+ students',
      'cut ai response latency 60% with redis caching and sql-based progress tracking',
      'secured $10,000 in funding by presenting measurable learning gains from pilot schools',
    ],
    tags: ['Node.js', 'Supabase', 'Redis', 'Nginx', 'Docker', 'RAG'],
    liveUrl: 'https://www.linkedin.com/company/docere-learn/posts/?feedView=all',
    liveLabel: 'read more',
  },
  {
    title: 'shipit',
    subtitle: 'ai release agent',
    description: [
      '5-phase agent taking a plain-english prompt to production in under 90 seconds',
      'closed the loop between jest failures and model input, raising task success 40%',
      'streamed real-time agent status over sse across 50+ test deployments',
    ],
    tags: ['TypeScript', 'Node.js', 'Express', 'Gemini 2.5', 'GitHub API', 'SSE'],
  },
  {
    title: 'distributed rate limiter',
    subtitle: 'distributed systems',
    description: [
      'redis-backed rate limiting with consistent enforcement across servers',
      'containerized microservices behind nginx for horizontal scaling',
      'real-time observability dashboard in react and express',
    ],
    tags: ['JavaScript', 'Redis', 'Nginx', 'Docker', 'React'],
    video: rateLimiterVideo,
    poster: rateLimiterPoster,
    codeUrl: 'https://github.com/AryaShrestha05/rateLimiter',
    imageScale: 1.25,
  },
  {
    title: 'posturize',
    subtitle: 'hackprinceton 2025',
    description: [
      'real-time posture analysis system built in under 36 hours',
      'opencv and mediapipe for vision-based pose detection',
      'd3.js visualizations for instant user feedback',
    ],
    tags: ['React', 'Flask', 'OpenCV', 'MediaPipe'],
    video: posturizeVideo,
    poster: posturizePoster,
    liveUrl: 'https://posturize-beta.vercel.app/',
    codeUrl: 'https://github.com/AryaShrestha05/posturize',
  },
  {
    title: 'grab a mojito',
    subtitle: 'interactive web app',
    description: [
      'bar app driven by scroll-based animation',
      'custom gsap transitions for seamless section handoffs',
      'responsive layout with dynamic filtering and search',
    ],
    tags: ['React', 'JavaScript', 'GSAP'],
    video: mojitoVideo,
    poster: mojitoPoster,
    liveUrl: 'https://grabamojito.vercel.app/',
    codeUrl: 'https://github.com/AryaShrestha05/grabamojito',
  },
  {
    title: 'polynomial regression',
    subtitle: 'machine learning from scratch',
    description: [
      'regression algorithm predicting housing prices over 5,000+ data points',
      'gradient descent implemented by hand, improving accuracy 15%',
      'engineered features to lift model performance',
    ],
    tags: ['Python', 'NumPy', 'Matplotlib'],
    image: regressionImage,
  },
];

const ProjectMedia = ({ project, className = '' }) => (
  <div className={`media-frame ${className}`}>
    <ProjectPreview
      video={project.video}
      poster={project.poster}
      image={project.image}
      title={project.title}
      imageScale={project.imageScale}
    />
  </div>
);

const ProjectLinks = ({ project, className = '' }) => {
  if (!project.liveUrl && !project.codeUrl) return null;

  return (
    <div className={`flex flex-wrap gap-2 md:gap-3 ${className}`}>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn cursor-target text-[10px] md:text-[11px] font-bold uppercase tracking-tighter"
          data-cursor-text="Open"
        >
          {project.liveLabel ?? 'live demo'}
        </a>
      )}
      {project.codeUrl && (
        <a
          href={project.codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn cursor-target text-[10px] md:text-[11px] font-bold uppercase tracking-tighter"
          data-cursor-text="GitHub"
        >
          view code
        </a>
      )}
    </div>
  );
};

const ProjectCopy = ({ project, headingClass, listClass = '' }) => (
  <>
    <h4 className={`${headingClass} font-bold text-foreground lowercase leading-[1.05]`}>
      {project.title}
    </h4>
    <p className="mt-2 text-[11px] md:text-xs font-semibold uppercase tracking-widest text-muted-foreground font-sans">
      {project.subtitle}
    </p>
    {project.context && (
      <p className="mt-1.5 text-[12px] md:text-[13px] font-light lowercase text-muted-foreground/80 font-sans">
        {project.context}
      </p>
    )}
    <ul className={`mt-5 space-y-2.5 font-sans ${listClass}`}>
      {project.description.map((point) => (
        <li key={point} className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className="mt-[8px] h-[3px] w-[3px] flex-shrink-0 rounded-full bg-muted-foreground"
          />
          <p className="text-sm md:text-[15px] leading-relaxed font-light lowercase text-muted-foreground">
            {point}
          </p>
        </li>
      ))}
    </ul>
  </>
);

const TagRow = ({ tags, className = '' }) => (
  <div className={`flex flex-wrap gap-1.5 md:gap-2 ${className}`}>
    {tags.map((tag) => (
      <span key={tag} className="tag">
        {tag}
      </span>
    ))}
  </div>
);

const Projects = () => {
  const sectionRef = useRef();
  const backgroundTextRef = useRef();
  const cardsRef = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ, (context) => {
      const { isDesktop, reduce } = context.conditions;
      const cards = cardsRef.current.filter(Boolean);

      if (reduce) {
        gsap.set([backgroundTextRef.current, ...cards], { clearProps: 'all' });
        return;
      }

      // Reveal on enter. Staggered so the eye is led down the grid in
      // reading order rather than everything popping at once.
      gsap.fromTo(
        cards,
        { opacity: 0, y: isDesktop ? 56 : 36 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION,
          stagger: STAGGER,
          ease: EASE_SOFT,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );

      // Title drifts opposite the scroll. Separates the display layer from
      // the content layer without moving the cards out of grid alignment.
      const drift = isDesktop ? 150 : 50;
      gsap.fromTo(
        backgroundTextRef.current,
        { x: drift },
        {
          x: -drift,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: SCRUB,
          },
        }
      );
    });

    return () => mm.revert();
  }, []);

  const lead = projectList.find((project) => project.variant === 'lead');
  const rest = projectList.filter((project) => project.variant !== 'lead');

  // Refs are keyed by a fixed index rather than an incrementing counter.
  // A counter would be advanced by React's detach (null) calls on re-render
  // and scramble the array the ScrollTrigger stagger depends on.
  const setCardRef = (index) => (el) => {
    cardsRef.current[index] = el;
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="min-h-[100dvh] py-20 md:py-32 flex flex-col items-center relative overflow-hidden"
    >
      {/* In normal flow, not absolutely positioned. A percentage `top` here
          resolves against the section height, and this section grows with
          every project added, so the title would drift down into the first
          card. Beyond and Contacts lay their titles out the same way. */}
      <div className="w-full flex justify-center mb-12 md:mb-16 select-none pointer-events-none">
        <h3 ref={backgroundTextRef} className="section-title">
          projects
        </h3>
      </div>

      <div className="w-full max-w-6xl px-5 sm:px-8 md:px-6 z-10">
        {/* Lead: the only split layout on the page. */}
        {lead && (
          <article
            ref={setCardRef(0)}
            className="glass-card p-5 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-9 mb-6 md:mb-8"
          >
            <div className="md:w-[52%] flex-shrink-0 flex flex-col">
              <ProjectMedia project={lead} className="aspect-video w-full" />
              <ProjectLinks project={lead} className="mt-4" />
            </div>
            <div className="md:w-[48%] flex flex-col">
              <ProjectCopy project={lead} headingClass="text-3xl sm:text-4xl md:text-[2.75rem]" />
              <TagRow tags={lead.tags} className="mt-auto pt-6" />
            </div>
          </article>
        )}

        {/* Grid: 7 remaining projects. One spans both columns so the rhythm
            breaks before the eye starts skimming. 7 items, 8 cells, no gaps. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {rest.map((project, index) => {
            const isWide = project.variant === 'wide';

            return (
              <article
                key={project.title}
                ref={setCardRef(index + 1)}
                className={`glass-card p-5 sm:p-6 md:p-7 flex flex-col ${
                  isWide ? 'md:col-span-2' : ''
                }`}
              >
                <ProjectMedia
                  project={project}
                  className={isWide ? 'w-full aspect-[21/9]' : 'w-full aspect-video'}
                />

                {isWide ? (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-9">
                    <div>
                      <ProjectCopy
                        project={project}
                        headingClass="text-2xl sm:text-3xl md:text-[2.25rem]"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <TagRow tags={project.tags} />
                      <ProjectLinks project={project} className="mt-4" />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex flex-col flex-grow">
                    <ProjectCopy project={project} headingClass="text-2xl md:text-[1.75rem]" />
                    <div className="mt-auto pt-6">
                      <TagRow tags={project.tags} />
                      <ProjectLinks project={project} className="mt-4" />
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;

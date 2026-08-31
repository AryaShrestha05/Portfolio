import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { MQ, SCRUB, EASE_SOFT, DURATION } from '../lib/motion';

import maristLogo from '../assets/photos/marist.jpeg';
import advocacyLogo from '../assets/photos/advocacyfinancial.jpeg';
import headstartLogo from '../assets/photos/headstart.jpeg';
import propelLogo from '../assets/photos/propel2excel.jpeg';
import colorstackLogo from '../assets/photos/colorstack.jpeg';

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    role: 'software engineer intern',
    company: 'advocacy financial',
    logo: advocacyLogo,
    period: 'aug 2026 - present',
    points: [
      'shipping a legal saas platform used by 60+ attorneys, cutting document prep time 40%',
      'designed the 55-table multi-tenant schema behind every client asset portfolio',
      'own the jest suite across 86 api endpoints, which took production bugs down 40%',
      'work directly with attorneys to turn casework into features they actually use',
    ],
    link: 'https://legacylouisiana.vercel.app/',
    linkLabel: 'the product',
  },
  {
    role: 'undergraduate research assistant',
    company: 'marist university',
    logo: maristLogo,
    logoZoom: true,
    period: 'may 2026 - aug 2026',
    points: [
      'designed a network protocol in c that cut packet delay 2.62x for 7,000+ daily users',
      'automated a 24/7 benchmarking pipeline across 6 tcp protocols with python and docker',
      'wrote custom linux kernel modules in c so tests ran with zero downtime',
      'turned the results into reproducible reports the lab still runs against',
    ],
    link: 'https://www.marist.edu/',
  },
  {
    role: 'tech fellow',
    company: 'headstart fellowship',
    logo: headstartLogo,
    period: 'spring 2026 cohort',
    points: [
      'selected cohort with 1:1 mentorship from industry engineers',
      'recruiting pipeline into f500 and high-growth startup teams',
      'weekly workshops on system design and technical interviewing',
    ],
    link: 'https://www.headstartfellowship.com/',
  },
  {
    role: 'lms quality developer',
    company: 'marist university',
    logo: maristLogo,
    logoZoom: true,
    period: 'apr 2025 - may 2026',
    points: [
      'built and maintain a 150+ page digital education site used campus-wide',
      'audited 3,000+ courses for wcag compliance and fixed what failed',
      'triage and resolve platform issues through jira alongside faculty',
    ],
    link: 'https://my.de.marist.edu/',
  },
  {
    role: 'phase 2 fellow',
    company: 'propel2excel',
    logo: propelLogo,
    period: '2025 - present',
    points: [
      'admitted directly to phase 2, roughly a 1% acceptance rate',
      '1:1 mentorship aimed at target-company technical prep',
      'ongoing interview, resume, and portfolio coaching',
    ],
    link: 'https://www.propel2excel.com/',
  },
  {
    role: 'member',
    company: 'colorstack',
    logo: colorstackLogo,
    period: '2025 - present',
    points: [
      'run resume reviews and peer mentorship for incoming freshmen',
      'recruiting and networking events with partner engineering teams',
      'community of underrepresented students building in tech together',
    ],
    link: 'https://www.colorstack.org/',
  },
];

const Experience = () => {
  const sectionRef = useRef();
  const experienceTextRef = useRef();
  const sliderRef = useRef();
  const pinContainerRef = useRef();
  const cardsRef = useRef([]);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ, (context) => {
      const { isDesktop, reduce } = context.conditions;

      // Reduced motion: no pin, no scroll hijack, no parallax. The track
      // below becomes a natively scrollable row instead.
      if (reduce) {
        gsap.set([experienceTextRef.current, sliderRef.current], { clearProps: 'all' });
        gsap.set(cardsRef.current, { clearProps: 'all' });
        return;
      }

      const slider = sliderRef.current;
      const cards = cardsRef.current.filter(Boolean);
      const drift = isDesktop ? 250 : 80;
      // Scale is a focus cue, not a layout tool: the focused card sits at 1:1 so
      // its body copy renders at its real size, and rest stays close enough that
      // off-centre cards are still readable.
      const restScale = isDesktop ? 0.88 : 0.94;
      const focusScale = 1;

      // Title fades up once, then drifts against the track for depth.
      gsap.fromTo(
        experienceTextRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION,
          ease: EASE_SOFT,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      gsap.fromTo(
        experienceTextRef.current,
        { x: -drift },
        {
          x: drift,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: () => `+=${slider.scrollWidth + window.innerHeight}`,
            scrub: SCRUB,
          },
        }
      );

      gsap.set(sliderRef.current, { opacity: 1, y: 0 });

      // Horizontal pan. Pin starts the moment the section tops out, so the
      // user never sees a half-panned track.
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: 'top top',
          end: () => `+=${slider.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      });

      pinTl.to(slider, {
        x: () => -(slider.scrollWidth - window.innerWidth),
        ease: 'none',
      });

      // Each card swells as it crosses centre. Communicates which card is
      // currently "the one being read" during the hijack.
      gsap.set(cards, { scale: restScale });

      cards.forEach((card) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              containerAnimation: pinTl,
              start: isDesktop ? 'left 95%' : 'left 100%',
              end: isDesktop ? 'right 5%' : 'right 0%',
              scrub: true,
            },
          })
          .to(card, { scale: focusScale, ease: 'power2.inOut' })
          .to(card, { scale: restScale, ease: 'power2.inOut' });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="relative overflow-hidden">
      <div
        ref={pinContainerRef}
        className={`w-full flex flex-col items-center justify-center ${
          prefersReduced ? 'py-20 md:py-28' : 'h-[100dvh]'
        }`}
      >
        {/* Background title. Sits behind the track, never interactive. */}
        <div
          className={`w-full flex justify-center z-0 pointer-events-none ${
            prefersReduced ? 'mb-10' : 'absolute top-[15vh]'
          }`}
        >
          <h3 ref={experienceTextRef} className="section-title">
            experience
          </h3>
        </div>

        {/* Card track. Scroll-hijacked when motion is allowed, a plain
            overflow-scroll row when it is not. */}
        <div
          className={`w-full flex items-center relative z-10 ${
            prefersReduced
              ? 'overflow-x-auto scrollbar-hide px-5'
              : 'mt-[15vh] sm:mt-[18vh] lg:mt-[12vh]'
          }`}
        >
          <div
            ref={sliderRef}
            className="flex items-stretch gap-5 lg:gap-6"
            style={
              prefersReduced
                ? { width: 'max-content' }
                : {
                    width: 'max-content',
                    paddingLeft: 'max(1rem, calc(50vw - 150px))',
                    paddingRight: 'max(1rem, 50vw)',
                  }
            }
          >
            {items.map((item, index) => (
              <article
                key={`${item.company}-${item.role}`}
                ref={(el) => (cardsRef.current[index] = el)}
                className="glass-card glass-card--static flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[400px] min-h-[440px] p-5 sm:p-6 lg:p-9 flex flex-col"
              >
                {/* Every entry currently has a logo. The monogram branch is
                    the fallback for future entries added before their brand
                    asset exists, so they degrade to type instead of a
                    broken image slot. */}
                <div className="w-14 h-14 md:w-16 md:h-16 mb-4 md:mb-6 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-card">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className={`w-full h-full object-cover ${item.logoZoom ? 'scale-110' : ''}`}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="text-xl md:text-2xl tracking-tight text-muted-foreground"
                      style={{ fontFamily: 'var(--font-primary)' }}
                    >
                      {item.monogram}
                    </span>
                  )}
                </div>

                <h4 className="text-2xl md:text-[1.75rem] font-bold leading-tight text-balance mb-1 text-foreground">
                  {item.company}
                </h4>

                <p className="text-[12px] md:text-[13px] font-semibold mb-4 md:mb-6 uppercase tracking-wide text-muted-foreground font-sans">
                  {item.role}
                  <span className="block mt-1 normal-case tracking-wide">
                    {item.period}
                  </span>
                </p>

                <ul className="space-y-2.5 md:space-y-3 font-sans flex-grow">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[9px] h-[4px] w-[4px] flex-shrink-0 rounded-full bg-muted-foreground"
                      />
                      <p className="min-w-0 break-words text-[14px] md:text-[15px] leading-relaxed lowercase text-foreground">
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3 mt-auto pt-5 border-t border-border/60">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn cursor-target text-[12px] font-bold uppercase tracking-tight"
                    data-cursor-text="Visit"
                  >
                    {item.linkLabel ?? 'website'}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaEnvelope, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { SiDevpost } from 'react-icons/si';
import { MQ, SCRUB, SCRUB_SLOW, EASE_SOFT, DURATION, STAGGER } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const Contacts = () => {
  const sectionRef = useRef();
  const letsRef = useRef();
  const connectRef = useRef();
  const linksRef = useRef([]);
  const footerRef = useRef();

  const socialLinks = [
    { icon: FaEnvelope, href: 'mailto:arya.shrestha1@marist.edu', label: 'Email' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/aryashrestha05/', label: 'LinkedIn' },
    { icon: FaGithub, href: 'https://github.com/AryaShrestha05', label: 'GitHub' },
    { icon: FaInstagram, href: 'https://www.instagram.com/aryashresthaa/', label: 'Instagram' },
    { icon: SiDevpost, href: 'https://devpost.com/AryaShrestha05', label: 'Devpost' },
  ];

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Everything lives inside matchMedia so mm.revert() actually tears it
    // all down, and so the `reduce` branch can skip it wholesale.
    mm.add(MQ, (context) => {
      const { isDesktop, reduce } = context.conditions;
      const links = linksRef.current.filter(Boolean);
      const titles = [letsRef.current, connectRef.current];

      if (reduce) {
        gsap.set([...titles, ...links, footerRef.current], { clearProps: 'all' });
        return;
      }

      gsap.fromTo(
        titles,
        { opacity: 0 },
        {
          opacity: 1,
          duration: DURATION,
          ease: EASE_SOFT,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      const drift = isDesktop ? 150 : 50;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: SCRUB,
          },
        })
        .fromTo(letsRef.current, { x: drift }, { x: -drift, ease: 'none' }, 0)
        .fromTo(connectRef.current, { x: -drift }, { x: drift, ease: 'none' }, 0);

      // Each icon converges from a different edge, so the row assembles
      // rather than fading in as one block.
      const directions = [
        { x: -60, y: -40 }, // email, from top-left
        { x: 0, y: -60 },   // linkedin, from top
        { x: 0, y: 60 },    // github, from bottom
        { x: 60, y: -40 },  // instagram, from top-right
        { x: 80, y: 0 },    // devpost, from right
      ];

      links.forEach((link, i) => {
        const from = directions[i] ?? { x: 0, y: 40 };

        gsap.set(link, {
          opacity: 0,
          x: from.x,
          y: from.y,
          scale: 0.6,
          rotation: i % 2 === 0 ? -10 : 10,
        });

        gsap.to(link, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: DURATION,
          delay: i * STAGGER,
          ease: 'back.out(1.7)',
          force3D: true,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
        });

        // Gentle scroll-linked float. Keeps the row from feeling frozen
        // once it has landed.
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.to(link, {
          y: dir * (15 + i * 5),
          rotation: dir * 3,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom top',
            scrub: SCRUB_SLOW,
          },
        });
      });

      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION,
          ease: EASE_SOFT,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 40%' },
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contacts"
      className="min-h-[100dvh] py-20 md:py-32 flex flex-col items-center relative overflow-hidden"
    >
      {/* Split Title with parallax */}
      <div className="w-full flex flex-col items-center mb-16 md:mb-20 select-none pointer-events-none">
        <h2 ref={letsRef} className="section-title !leading-[0.9]">
          let's
        </h2>
        <h2 ref={connectRef} className="section-title mt-1 !leading-[0.9]">
          connect!
        </h2>
      </div>

      {/* Social Icons */}
      <div className="z-10 flex items-center justify-center flex-wrap gap-4 sm:gap-6 md:gap-10 px-5">
        {socialLinks.map((social, i) => (
          <div
            key={social.label}
            ref={el => linksRef.current[i] = el}
          >
            <a
              href={social.href}
              target={social.href.startsWith('mailto') ? undefined : '_blank'}
              rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="cursor-target block p-3 md:p-4 rounded-full border border-border bg-card/50 hover:bg-card hover:border-foreground active:scale-95 transition-all duration-300"
              aria-label={social.label}
            >
              <social.icon
                size={24}
                className="text-foreground md:w-7 md:h-7"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div ref={footerRef} className="mt-16 md:mt-24 text-center px-5">
        <p className="text-xs md:text-sm font-sans lowercase tracking-wide footer-glow">
          built with love, by arya shrestha
        </p>
      </div>
    </section>
  );
};

export default Contacts;

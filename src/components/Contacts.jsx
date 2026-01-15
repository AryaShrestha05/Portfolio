import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaEnvelope, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { SiDevpost } from 'react-icons/si';

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
    // Title entrance animation
    gsap.fromTo(
      [letsRef.current, connectRef.current],
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

    // Parallax timeline for split title animation
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    parallaxTl
      .fromTo(letsRef.current, { x: 150 }, { x: -150, ease: "none" }, 0)
      .fromTo(connectRef.current, { x: -150 }, { x: 150, ease: "none" }, 0);

    // Links animation - each icon comes from a different direction
    const directions = [
      { x: -60, y: -40 },   // Email - from top-left
      { x: 0, y: -60 },     // LinkedIn - from top
      { x: 0, y: 60 },      // GitHub - from bottom
      { x: 60, y: -40 },    // Instagram - from top-right
      { x: 80, y: 0 },      // Devpost - from right
    ];

    linksRef.current.forEach((link, i) => {
      if (!link) return;

      // Set initial state immediately
      gsap.set(link, {
        opacity: 0,
        x: directions[i].x,
        y: directions[i].y,
        scale: 0.6,
        rotation: (i % 2 === 0) ? -10 : 10
      });

      // Entrance animation
      gsap.to(link, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1,
        delay: i * 0.08,
        ease: "back.out(1.7)",
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
        }
      });

      // Continuous scroll-linked floating animation
      const floatDirection = i % 2 === 0 ? 1 : -1;
      const floatAmount = 15 + (i * 5); // Each button floats differently

      gsap.to(link, {
        y: floatDirection * floatAmount,
        rotation: floatDirection * 3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom top",
          scrub: 1.5,
        }
      });
    });

    // Footer animation
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 40%",
        }
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contacts"
      className="min-h-screen py-20 md:py-32 flex flex-col items-center relative overflow-hidden"
    >
      {/* Split Title with parallax */}
      <div className="w-full flex flex-col items-center mb-16 md:mb-20 select-none pointer-events-none">
        <h2 ref={letsRef} className="section-title text-6xl sm:text-7xl md:text-9xl !leading-[0.9]">
          let's
        </h2>
        <h2 ref={connectRef} className="section-title text-6xl sm:text-7xl md:text-9xl mt-1 !leading-[0.9]">
          connect!
        </h2>
      </div>

      {/* Social Icons */}
      <div className="z-10 flex items-center justify-center flex-wrap gap-4 sm:gap-6 md:gap-10 px-5">
        {socialLinks.map((social, i) => (
          <div
            key={i}
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

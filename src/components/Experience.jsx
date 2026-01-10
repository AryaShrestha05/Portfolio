import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef();
  const experienceTextRef = useRef();
  const sliderRef = useRef();
  const pinContainerRef = useRef();

  useEffect(() => {
    // Wait for layout to calculate proper widths
    const calculateScroll = () => {
      if (!sliderRef.current || !pinContainerRef.current) return;

      const scrollWidth = sliderRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const amountToScroll = scrollWidth - viewportWidth;

      // 1. Initial Entrance Animation with smooth easing
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true // Only play once for performance
        }
      });

      // Set initial states for smooth animation
      gsap.set([experienceTextRef.current, sliderRef.current], {
        opacity: 0,
        y: 50,
        force3D: true // Force GPU acceleration
      });

      entranceTl.to([experienceTextRef.current, sliderRef.current],
        { 
          opacity: 1, 
          y: 0,
          duration: 1.2, 
          ease: "power2.out",
          stagger: 0.15,
          force3D: true
        }
      );

      // 2. PINNING & HORIZONTAL SCROLL with smooth interpolation
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: "top top",
          end: () => `+=${amountToScroll + viewportWidth}`,
          pin: true,
          scrub: 0.3, // Very smooth interpolation (lower = smoother)
          fastScrollEnd: true, // Handle fast scrolling better
          anticipatePin: 1,
          pinSpacing: true,
          invalidateOnRefresh: true,
        }
      });

      pinTl.to(sliderRef.current, {
        x: () => -(sliderRef.current.scrollWidth - window.innerWidth),
        ease: "none",
        force3D: true // GPU acceleration for smooth performance
      });

      // 3. BACKGROUND TEXT PARALLAX with smooth interpolation
      const parallaxTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5, // Smooth interpolation for parallax
        onUpdate: (self) => {
          const progress = self.progress;
          if (experienceTextRef.current) {
            gsap.set(experienceTextRef.current, {
              x: 150 - (progress * 300),
              force3D: true // GPU acceleration
            });
          }
        }
      });

      // 4. SMOOTH EXIT ANIMATION when pin is released - smooth transition after unpin
      // This handles the smooth animation when the section unpins and scrolls out
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.25, // Smooth interpolation - balances responsiveness with smoothness
        onUpdate: (self) => {
          // Only animate exit when section is leaving bottom of viewport
          if (self.progress > 0.8 && experienceTextRef.current && sliderRef.current) {
            const exitProgress = (self.progress - 0.8) / 0.2; // Scale 0.8-1.0 to 0-1.0
            gsap.set([experienceTextRef.current, sliderRef.current], {
              opacity: 1 - exitProgress,
              y: exitProgress * -40,
              force3D: true,
              willChange: 'transform, opacity' // Hint browser for optimization
            });
          } else if (self.progress <= 0.8 && experienceTextRef.current && sliderRef.current) {
            // Reset when coming back into view
            gsap.set([experienceTextRef.current, sliderRef.current], {
              opacity: 1,
              y: 0,
              force3D: true
            });
          }
        }
      });
    };

    // Calculate after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(calculateScroll, 100);

    // Recalculate on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
      setTimeout(calculateScroll, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      // Kill all ScrollTriggers for this component
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars && (
          trigger.vars.trigger === pinContainerRef.current ||
          trigger.vars.trigger === sectionRef.current ||
          trigger.trigger === pinContainerRef.current ||
          trigger.trigger === sectionRef.current
        )) {
          trigger.kill();
        }
      });
    };
  }, []);

  const items = [1, 2, 3, 4, 5];

  return (
    <section 
      ref={sectionRef} 
      id="experience"
      className="relative min-h-[200vh] bg-transparent"
    >
      {/* This container gets pinned */}
      <div 
        ref={pinContainerRef} 
        className="h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-transparent"
      >
        {/* Parallax Header - Exact same style as About Me */}
        <div className="flex flex-col items-center mb-16 select-none pointer-events-none absolute top-20 z-20">
          <h3 
            ref={experienceTextRef} 
            className="text-9xl font-thin lowercase tracking-tighter whitespace-nowrap text-white"
          >
            experience
          </h3>
        </div>

        {/* Horizontal Slider Container */}
        <div className="w-full overflow-visible mt-32">
          <div 
            ref={sliderRef} 
            className="flex gap-12 items-center will-change-transform"
            style={{ 
              width: 'max-content',
              transform: 'translateZ(0)', // Force GPU acceleration
              backfaceVisibility: 'hidden' // Smooth rendering
            }}
          >
            {items.map((_, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-[80vw] md:w-[500px] h-[550px] bg-gray-900/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 z-10 flex flex-col"
              >
                <span className="text-white/10 text-8xl font-bold lowercase">0{index + 1}</span>
                {/* Space for your content */}
              </div>
            ))}
            {/* End Spacer to ensure last card is fully visible */}
            <div className="flex-shrink-0 w-[50vw] md:w-[30vw]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
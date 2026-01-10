import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contacts = () => {
  const sectionRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1
        }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contacts"
      className="min-h-screen py-20 px-5 bg-transparent flex items-center justify-center"
    >
      <div ref={contentRef} className="container mx-auto max-w-4xl">
        <h2 className="text-5xl font-bold text-white text-center mb-12">Contacts</h2>
        <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-lg">
          <p className="text-gray-300 text-lg leading-relaxed">
            Your contact information will go here.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contacts;

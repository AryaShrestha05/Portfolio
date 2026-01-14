import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaEnvelope, FaLinkedin, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';

const Contacts = () => {
  const ref = useRef(null);
  const [startTyping, setStartTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const inView = useInView(ref, { once: true, margin: "-30% 0px -30% 0px" });

  useEffect(() => {
    if (inView) {
      setStartTyping(true);
    }
  }, [inView]);

  // Track dark mode
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const iconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const socialLinks = [
    { icon: FaEnvelope, href: 'mailto:your.email@example.com', label: 'Email' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/yourprofile', label: 'LinkedIn' },
    { icon: FaGithub, href: 'https://github.com/yourprofile', label: 'GitHub' },
    { icon: FaInstagram, href: 'https://instagram.com/yourprofile', label: 'Instagram' },
    { icon: FaTwitter, href: 'https://twitter.com/yourprofile', label: 'Twitter' },
  ];

  return (
    <section
      id="contacts"
      ref={ref}
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-8"
    >
      <motion.div
        className="w-full max-w-4xl flex flex-col items-center justify-center text-center"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 1 } },
        }}
      >
        {/* Animated Title */}
        <div className="h-16 md:h-20 mb-8">
          {startTyping ? (
            <TypeAnimation
              sequence={[
                'get in touch...',
                2000,
                'reach out...',
                2000,
                'say hello...',
                2000,
                "let's connect...",
                2000,
              ]}
              wrapper="h2"
              cursor={true}
              repeat={Infinity}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-primary)' }}
            />
          ) : (
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent"
              style={{ fontFamily: 'var(--font-primary)' }}
            >
              get in touch...
            </h2>
          )}
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl mb-12 max-w-2xl text-muted-foreground font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          i love connecting with fellow developers, creators, and curious minds!
        </motion.p>

        {/* Social Icons */}
        <motion.div
          className="flex items-center justify-center flex-wrap gap-x-10 gap-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target={social.href.startsWith('mailto') ? undefined : '_blank'}
              rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="text-foreground hover:text-muted-foreground transition-colors duration-300 cursor-target"
              variants={iconVariants}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label={social.label}
            >
              <social.icon size={36} />
            </motion.a>
          ))}
        </motion.div>

        {/* Footer text */}
        <motion.p
          className="mt-20 text-sm text-muted-foreground font-sans"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          built with care by arya shrestha
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Contacts;

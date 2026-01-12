import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RotatingText = ({
  texts = [],
  interval = 3000,
  className = '',
  splitBy = 'character', // 'character', 'word', 'line'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % texts.length);
  }, [texts.length]);

  useEffect(() => {
    if (texts.length <= 1) return;

    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval, texts.length]);

  const splitText = (text) => {
    switch (splitBy) {
      case 'word':
        return text.split(' ');
      case 'line':
        return text.split('\n');
      case 'character':
      default:
        return text.split('');
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
      rotateX: -90,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      rotateX: 90,
      transition: {
        duration: 0.2,
      },
    },
  };

  const currentText = texts[currentIndex] || '';
  const parts = splitText(currentText);

  return (
    <span className={`inline-block ${className}`} style={{ perspective: '1000px' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          className="inline-flex flex-wrap"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {parts.map((part, index) => (
            <motion.span
              key={`${currentIndex}-${index}`}
              className="inline-block"
              variants={itemVariants}
              style={{
                transformStyle: 'preserve-3d',
                whiteSpace: splitBy === 'character' ? 'pre' : 'normal',
              }}
            >
              {part}
              {splitBy === 'word' && index < parts.length - 1 && '\u00A0'}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;

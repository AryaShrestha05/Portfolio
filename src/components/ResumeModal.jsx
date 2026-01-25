import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import resumePdf from '../assets/resume/arya_shrestha_resume.pdf';

const ResumeModal = ({ isOpen, onClose }) => {
  const overlayRef = useRef();
  const modalRef = useRef();
  const scrollOffset = useRef(0);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset cursor immediately when modal opens to prevent stuck state
      const cursorRing = document.querySelector('.cursor-ring');
      if (cursorRing) {
        cursorRing.classList.remove('is-hovering');
        gsap.killTweensOf(cursorRing);
        gsap.set(cursorRing, {
          width: 20,
          height: 20,
          borderRadius: "50%",
        });
      }
      const cursorDot = document.querySelector('.cursor-dot');
      if (cursorDot) {
        gsap.killTweensOf(cursorDot);
        gsap.set(cursorDot, {
          opacity: 0,
          scale: 0.5,
        });
      }

      // 1. Capture current scroll position
      scrollOffset.current = window.scrollY;

      // 2. Freeze the background at that specific scroll spot
      document.body.style.top = `-${scrollOffset.current}px`;
      document.body.classList.add('no-scroll');

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out', delay: 0.1 }
      );
    }

    return () => {
      // 3. Clean up and restore scroll position
      if (document.body.classList.contains('no-scroll')) {
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        window.scrollTo(0, scrollOffset.current);
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    // Reset cursor when closing modal
    const cursorRing = document.querySelector('.cursor-ring');
    if (cursorRing) {
      cursorRing.classList.remove('is-hovering');
      gsap.killTweensOf(cursorRing);
      gsap.set(cursorRing, {
        width: 20,
        height: 20,
        borderRadius: "50%",
      });
    }
    const cursorDot = document.querySelector('.cursor-dot');
    if (cursorDot) {
      gsap.killTweensOf(cursorDot);
      gsap.set(cursorDot, {
        opacity: 0,
        scale: 0.5,
      });
    }

    gsap.to(modalRef.current, {
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 0.25,
      ease: 'power2.in'
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumePdf;
    link.download = 'arya_shrestha_resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      /* Ensure font-sans is used and hide-cursor is applied */
      className="fixed inset-0 z-[9999] flex items-start justify-center p-4 md:p-8 pt-32 md:pt-36 bg-background/90 backdrop-blur-xl hide-cursor font-sans"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl h-[calc(100vh-180px)] flex flex-col glass-card overflow-hidden bg-card text-card-foreground shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:px-8 border-b border-border/80">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Resume
            </h2>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              Arya Shrestha | Marist University
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity border border-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              download
            </button>

            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-border hover:bg-muted text-foreground transition-all duration-200"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* PDF Viewer - Explicitly White */}
        <div className="flex-1 p-3 md:p-6 bg-muted/10">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border shadow-inner bg-white">
            {/* Loading State */}
            {!pdfLoaded && !pdfError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Loading PDF...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {pdfError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4 text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm text-muted-foreground">Unable to load PDF preview</p>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-foreground text-background rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    Download Instead
                  </button>
                </div>
              </div>
            )}

            <iframe
              src={`${resumePdf}#toolbar=0&navpanes=0`}
              title="Resume"
              className="w-full h-full"
              style={{ border: 'none' }}
              onLoad={() => setPdfLoaded(true)}
              onError={() => setPdfError(true)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="py-4 border-t border-border/80 bg-background/50 flex items-center justify-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
            press <kbd className="px-2 py-1 mx-1 rounded bg-muted text-foreground border border-border font-sans lowercase">esc</kbd> to exit
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
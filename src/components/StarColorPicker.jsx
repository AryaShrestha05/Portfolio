import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const StarColorPicker = ({ onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const panelRef = useRef();

  const colors = [
    { hex: '#a3a3a3', name: 'Gray' },
    { hex: '#4ade80', name: 'Green' },
    { hex: '#a78bfa', name: 'Purple' },
    { hex: '#fb923c', name: 'Orange' },
    { hex: '#60a5fa', name: 'Blue' },
    { hex: '#fbbf24', name: 'Yellow' },
    { hex: '#f472b6', name: 'Pink' },
    { hex: '#22d3ee', name: 'Cyan' }
  ];

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) closePanel();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  const closePanel = () => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        opacity: 0, scale: 0.8, y: 20,
        duration: 0.2, ease: 'power2.in',
        onComplete: () => setIsOpen(false)
      });
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (color) => {
    onColorChange(color.hex);
    closePanel();
  };

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute bottom-10 right-0 flex flex-col gap-1.5 p-2 rounded-full bg-card/80 backdrop-blur border border-border"
        >
          {colors.map((color) => (
            <button
              key={color.hex}
              onClick={() => handleSelect(color)}
              aria-label={`Set star color to ${color.name}`}
              className="w-5 h-5 rounded-full hover:scale-125 transition-transform cursor-target"
              style={{
                backgroundColor: color.hex,
                boxShadow: `0 0 6px ${color.hex}60`
              }}
            />
          ))}
        </div>
      )}
      <button
        onClick={() => isOpen ? closePanel() : setIsOpen(true)}
        aria-label="Open star color picker"
        className="w-8 h-8 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center hover:border-foreground transition-colors cursor-target"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-foreground">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
        </svg>
      </button>
    </div>
  );
};

export default StarColorPicker;

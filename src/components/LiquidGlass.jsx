import React, { useEffect, useRef } from 'react';

const LiquidGlass = ({ children }) => {
  const glassRef = useRef(null);
  const specularRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!glassRef.current || !specularRef.current) return;
      const rect = glassRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      specularRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-white/20">
      <div ref={glassRef} className="relative z-10 p-8">
        <div ref={specularRef} className="absolute inset-0 pointer-events-none transition-opacity duration-300" />
        {children}
      </div>
    </div>
  );
};

export default LiquidGlass;
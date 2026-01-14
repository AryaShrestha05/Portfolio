import { useState } from "react";
import {
  GooeyNav,
  TargetCursor,
  StartScreen,
  About,
  Experience,
  Projects,
  Beyond,
  Contacts,
  FboAnimation,
  Preloader
} from "./components";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div
      className={`relative min-h-screen bg-background text-foreground transition-colors duration-300 ${loading ? 'cursor-none' : ''}`}
      style={{ backgroundColor: 'var(--color-background, #ffffff)' }}
    >
      {/* 1. Hidden SVG Filter for Gooey Effects */}
      <svg className="hidden">
        <defs>
          <filter id="gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* 2. Loading Screen */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* 3. Custom Snapping Cursor - Hidden if loading */}
      {!loading && <TargetCursor />}

      {/* 4. Background Layer */}
      <div
        className="fixed inset-0 z-0 bg-background transition-colors duration-300"
        style={{ backgroundColor: 'var(--color-background, #ffffff)' }}
      >
        <FboAnimation />
      </div>

      {/* 5. UI Layer */}
      <div className={`relative z-10 transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 pointer-events-none">
          <div className="pointer-events-auto">
            <GooeyNav
              items={[
                { label: 'Home', href: '#start-screen' },
                { label: 'About', href: '#about' },
                { label: 'Experience', href: '#experience' },
                { label: 'Projects', href: '#projects' },
                { label: 'Contact', href: '#contacts' }
              ]}
            />
          </div>
        </div>

        <main className="w-full pt-24">
          {/* We pass isLoading here to trigger Hero animations later */}
          <StartScreen isLoading={loading} />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
            <About />
            <Experience />
            <Projects />
            <Beyond />
            <Contacts />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;